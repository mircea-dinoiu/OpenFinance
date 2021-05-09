import {
    Box,
    Button,
    Checkbox,
    Fab,
    FormControlLabel,
    LinearProgress,
    Menu,
    Paper,
    Theme,
    useMediaQuery,
} from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import AddIcon from '@material-ui/icons/Add';
import IconSplit from '@material-ui/icons/CallSplitRounded';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import IconStar from '@material-ui/icons/Star';
import IconStarBorder from '@material-ui/icons/StarBorder';
import {BaseTable, TableHeader, TableHeaderTop} from 'app/BaseTable';
import {refreshWidgets as onRefreshWidgets} from 'refreshWidgets/state';

import {BigLoader} from 'app/loaders';
import {TProject} from 'projects/defs';
import {ContextMenuItems, TypeContextMenuItemsProps} from 'transactions/ContextMenuItems';
import {Tooltip} from 'app/Tooltip';
import {WeightDisplay} from 'transactions/cells/WeightDisplay';
import {ExpenseListItemContent} from 'transactions/ExpenseListItemContent';
import {TransactionsColumns} from 'transactions/ExpenseTableColumns';
import {getTrProps} from 'transactions/helpers/getTrProps';
import {mergeTransactions} from 'transactions/helpers/mergeTransactions';
import {ImportTransactions} from 'transactions/ImportTransactions';
import {MainScreenCreatorDialog} from 'transactions/MainScreenCreatorDialog';
import {MainScreenDeleteDialog} from 'transactions/MainScreenDeleteDialog';
import {MainScreenEditDialog, TransactionEditorProps} from 'transactions/MainScreenEditDialog';
import {MainScreenListGroup} from 'transactions/MainScreenListGroup';
import {SplitAmountField} from 'transactions/SplitAmountField';
import {StatsTable} from 'transactions/StatsTable';
import {SummaryTotal} from 'transactions/SummaryTotal';
import {TransactionsEndDatePicker} from 'transactions/TransactionsEndDatePicker';
import {TransactionsMobileHeader} from 'transactions/TransactionsMobileHeader';
import {formToModel, modelToForm} from 'transactions/form';
import {TransactionModel, TransactionStatus} from 'transactions/defs';
import {Api} from 'app/Api';
import {QueryParam} from 'app/QueryParam';
import {Accounts} from 'accounts/defs';
import {TCurrencyMap} from 'currencies/defs';
import {TBootstrap} from 'users/defs';
import * as H from 'history';
import _, {isEqual, memoize, range} from 'lodash';
import groupBy from 'lodash/groupBy';
import moment from 'moment';
import React, {PureComponent, ReactNode, useState, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {
    Filter,
    SortingRule,
    FilteredChangeFunction,
    PageChangeFunction,
    PageSizeChangeFunction,
    SortedChangeFunction,
} from 'react-table-6';
import {Dispatch} from 'redux';
import {GlobalState} from 'app/state/defs';
import {useSelectedProject} from 'projects/state';
import {useEndDate} from 'app/dates/helpers';

import {createXHR} from 'app/fetch';
import {makeUrl} from 'app/url';
import {
    TransactionsContext,
    TTransactionsContext,
    TransactionsContextDefaultState,
} from 'transactions/TransactionsContext';
import {useTransactionsParams} from 'transactions/useTransactionsParams';
import {TransactionsScrollListener} from 'transactions/TransactionsScrollListener';

type TypeOwnProps = {};

type TypeProps = {
    history: H.History;
    params: {
        pageSize: number;
        page: number;
        sorters: SortingRule[];
        filters: Filter[];
    };
    endDate: string;
    isDesktop: boolean;
    currencies: TCurrencyMap;
    refreshWidgets: string;
    dispatch: Dispatch;
    moneyLocations: Accounts;
    user: TBootstrap;
    project: TProject;
    transactionsState: TTransactionsContext['state'];
    transactionsSetState: TTransactionsContext['setState'];
    dispatchRequest: TTransactionsContext['dispatchRequest'];
} & TypeOwnProps;

type TypeState = {
    results: TransactionModel[];

    addModalOpen: boolean;
    editDialogOpen: boolean;
    deleteDialogOpen: boolean;
    displayHidden: boolean;
    splitAmount: string;

    contextMenuDisplay: boolean;
    contextMenuLeft: number;
    contextMenuTop: number;
};

const entityName = 'transaction';

const getTdProps = memoize(() => ({
    style: {
        position: 'relative',
    },
}));

class MainScreenListWrapped extends PureComponent<TypeProps, TypeState> {
    state: TypeState = {
        results: [],

        contextMenuDisplay: false,
        contextMenuTop: 0,
        contextMenuLeft: 0,

        addModalOpen: false,
        editDialogOpen: false,
        deleteDialogOpen: false,

        displayHidden: false,
        splitAmount: '',
    };

    componentDidMount() {
        this.refresh();
    }

    componentDidUpdate(prevProps: TypeProps) {
        if (prevProps.refreshWidgets !== this.props.refreshWidgets) {
            this.refresh();
        } else if (prevProps.endDate !== this.props.endDate) {
            this.refresh();
        } else if (!isEqual(prevProps.params, this.props.params)) {
            this.loadMore();
        }
    }

    handleToggleDeleteDialog = () => this.setState((state) => ({deleteDialogOpen: !state.deleteDialogOpen}));
    handleToggleEditDialog = () =>
        this.setState((state) => ({
            editDialogOpen: !state.editDialogOpen,
        }));
    handleToggleAddModal = () =>
        this.setState((state) => ({
            addModalOpen: !state.addModalOpen,
        }));

    handleDelete = async () => {
        this.handleToggleDeleteDialog();

        await this.handleRequestDelete(this.selectedItems.map((each) => each.id));

        this.props.dispatch(onRefreshWidgets());
    };

    get hasFiltersSet() {
        return this.props.params.filters.filter((each) => each.value.text !== '').length > 0;
    }

    get displayArchived() {
        return this.state.displayHidden || this.hasFiltersSet;
    }

    loadMore = async ({
        results = this.state.results,
        page = this.props.params.page,
        pageSize = this.props.params.pageSize,
    } = {}) => {
        if (this.props.transactionsState.loading) {
            return;
        }

        this.handleCloseContextMenu();

        const {sorters, filters} = this.props.params;

        this.props.transactionsSetState((state) => ({loading: state.loading + 1}));

        const response = await createXHR<TransactionModel[]>({
            url: makeUrl(Api.transactions, {
                end_date: this.props.endDate,
                page,
                limit: pageSize,
                sorters: JSON.stringify(sorters),
                filters: JSON.stringify(
                    [
                        this.displayArchived
                            ? null
                            : {
                                  id: 'hidden',
                                  value: false,
                              },
                        ...filters,
                    ].filter(Boolean),
                ),
                projectId: this.props.project.id,
            }),
        });
        const json = response.data;
        const nextResults = page > 1 ? results.concat(json) : json;

        this.props.transactionsSetState((state) => ({firstLoad: false, loading: state.loading - 1}));
        this.setState({
            results: nextResults,
        });
    };

    getGroupedResults() {
        const results = this.state.results;

        return groupBy(results, (each) => moment(each.created_at).format('YYYY-MM-DD'));
    }

    refresh = async () => {
        await this.loadMore({
            results: [],
            page: 1,
            pageSize: this.props.params.page * this.props.params.pageSize,
        });
    };

    handleReceivedSelectedIds = (selectedIds: number[]) =>
        this.props.transactionsSetState({
            selectedIds,
        });
    handleChangeContextMenu = ({display, top = 0, left = 0}: {display: boolean; top?: number; left?: number}) =>
        this.setState({
            contextMenuDisplay: display,
            contextMenuTop: top,
            contextMenuLeft: left,
        });

    getTrProps = (state: any, rowInfo?: {original: TransactionModel}) =>
        rowInfo
            ? getTrProps({
                  selectedIds: this.props.transactionsState.selectedIds,
                  onEdit: this.handleToggleEditDialog,
                  onReceiveSelectedIds: this.handleReceivedSelectedIds,
                  onChangeContextMenu: this.handleChangeContextMenu,
                  item: rowInfo.original,
              })
            : {};

    get selectedItems() {
        return this.state.results.filter((r) => this.props.transactionsState.selectedIds.includes(r.id));
    }

    computeAmount(transactions: TransactionModel[]) {
        const mlIdToCurrencyId = this.props.moneyLocations.reduce((acc, each) => {
            acc[each.id] = each.currency_id;

            return acc;
        }, {});

        return (
            <SummaryTotal
                summaryItems={transactions.map((t) => ({
                    cashValue: t.quantity * t.price,
                    currencyId: mlIdToCurrencyId[t.money_location_id],
                    reference: t.toString(),
                }))}
                colorize={false}
            />
        );
    }

    computeWeight(items: TransactionModel[]) {
        return items.reduce((acc, each) => acc + (each.weight || 0), 0);
    }

    renderTableHeader() {
        const page = this.state.results;
        const selected = this.selectedItems;

        return (
            <TableHeader>
                <TableHeaderTop columnCount={7}>
                    <TransactionsEndDatePicker />
                    <>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.displayArchived}
                                    onChange={this.handleToggleDisplayHidden}
                                    color="default"
                                    disabled={this.hasFiltersSet}
                                />
                            }
                            label="Display Archived"
                        />
                    </>
                    <>
                        <SplitAmountField
                            error={isNaN(this.parseSplitAmount(this.state.splitAmount))}
                            placeholder="Split or Reduce"
                            value={this.state.splitAmount}
                            onChange={(event) => {
                                this.setState({
                                    splitAmount: event.target.value,
                                });
                            }}
                            margin="normal"
                            variant="outlined"
                            InputProps={{
                                style: {
                                    height: '32px',
                                },
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            title="Split into two transactions"
                                            onClick={() => this.handleClickSplitReduce(true)}
                                            disabled={!this.isSplitAmountValid()}
                                        >
                                            <IconSplit />
                                        </IconButton>
                                        <IconButton
                                            title="Reduce"
                                            onClick={() => this.handleClickSplitReduce(false)}
                                            disabled={!this.isSplitAmountValid()}
                                        >
                                            <IndeterminateCheckBoxIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </>
                    <Button
                        variant="outlined"
                        onClick={(event) => {
                            event.preventDefault();

                            this.handleReceivedSelectedIds(this.state.results.map((r) => r.id));
                        }}
                    >
                        Select All
                    </Button>
                    <Fab variant="extended" color="primary" onClick={this.handleToggleAddModal} size="small">
                        <AddIcon />
                    </Fab>
                    <ImportTransactions
                        onSubmit={async (transactions) => {
                            await this.handleRequestCreate(transactions);
                            this.props.dispatch(onRefreshWidgets());
                        }}
                    />
                </TableHeaderTop>
                <div>
                    {this.renderStats('Loaded', page)}
                    {this.renderStats('Selected', selected)}
                    {range(0, 6).map((rating) =>
                        this.renderStats(
                            <React.Fragment>
                                {rating === 0 ? (
                                    <IconStarBorder style={{height: 20, width: 20}} />
                                ) : (
                                    range(0, rating).map((i) => (
                                        <IconStar
                                            key={i}
                                            style={{
                                                height: 20 - rating,
                                                width: 20 - rating,
                                            }}
                                        />
                                    ))
                                )}
                            </React.Fragment>,
                            page.filter((each) =>
                                rating === 0 ? each.favorite == null || each.favorite === 0 : each.favorite === rating,
                            ),
                        ),
                    )}
                </div>
                {(() => {
                    const byYear = Object.entries(
                        _.groupBy(page, (t) => new Date(t.created_at).getFullYear()),
                    ).reverse();
                    const byMonth = Object.entries(
                        _.groupBy(page, (t) => moment(t.created_at).format('YYYY-MM')),
                    ).slice(0, 12);

                    return (
                        <Box marginTop={1}>
                            {byYear.map(([year, transactions]) => this.renderStats(year, transactions))}
                            {byMonth.map(([dateString, transactions]) => {
                                const date = moment(dateString);

                                return this.renderStats(
                                    date.format(
                                        date.toDate().getFullYear() !== Number(byYear[0][0]) ? 'MMM YYYY' : 'MMM',
                                    ),
                                    transactions,
                                );
                            })}
                        </Box>
                    );
                })()}
            </TableHeader>
        );
    }

    isSplitAmountValid() {
        const amount = this.parseSplitAmount(this.state.splitAmount);

        if (isNaN(amount)) {
            return false;
        }

        if (amount <= 0) {
            return false;
        }

        const selectedItems = this.selectedItems;

        return selectedItems.length >= 1 && selectedItems.every((each) => Math.abs(each.price) > Math.abs(amount));
    }

    parseSplitAmount(number: string) {
        const working = number.trim();

        if (!working) {
            return 0;
        }

        return Number(working);
    }

    handleClickSplitReduce = async (isSplit: boolean) => {
        const selectedItems = this.selectedItems;
        const splitBy = this.parseSplitAmount(this.state.splitAmount);

        if (isSplit) {
            await this.handleRequestCreate(
                selectedItems.map((each) => {
                    const res = this.copyItem(each);
                    const sign = res.price < 0 ? -1 : 1;

                    res.price = sign * splitBy;

                    return res;
                }),
            );
        }

        await this.handleRequestUpdate(
            selectedItems.map((each) => {
                const sign = each.price < 0 ? -1 : 1;
                const splittedAmount = sign * (Math.abs(each.price) - splitBy);

                const ret: TransactionModel = {
                    ...each,
                    price: Math.round(splittedAmount * 100) / 100,
                };

                return ret;
            }),
        );

        this.props.dispatch(onRefreshWidgets());
    };

    handleToggleStateKey = (key: 'displayHidden') => () => {
        this.setState(
            // @ts-ignore
            (state) => ({
                [key]: !state[key],
            }),
            this.refresh,
        );
    };

    handleToggleDisplayHidden = this.handleToggleStateKey('displayHidden');

    renderStats(head: ReactNode, items: TransactionModel[]) {
        return (
            <div style={{display: 'inline-block', marginRight: 5}}>
                <Tooltip
                    tooltip={
                        <StatsTable>
                            <tbody>
                                <tr>
                                    <th>Balance:</th>
                                    <td>{this.computeAmount(items)}</td>
                                </tr>
                                <tr>
                                    <th>Weight:</th>
                                    <td>
                                        <WeightDisplay
                                            item={{
                                                weight: this.computeWeight(items),
                                            }}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </StatsTable>
                    }
                >
                    <Chip
                        label={
                            <React.Fragment>
                                {head}&nbsp;<strong>({items.length})</strong>
                            </React.Fragment>
                        }
                        variant="outlined"
                    />
                </Tooltip>
            </div>
        );
    }

    handleCloseContextMenu = () => this.handleChangeContextMenu({display: false});

    updateRecords = async (ids: number[], data: Partial<TransactionModel>) => {
        try {
            await this.handleRequestUpdate(ids.map((id) => ({id, ...data})));

            this.props.dispatch(onRefreshWidgets());
        } catch (e) {
            console.error(e);
            // todo
        }
    };

    updateSelectedRecords = (data: Partial<TransactionModel>) =>
        this.updateRecords(
            this.selectedItems.map((each) => each.id),
            data,
        );

    handleRequestDelete = (ids: number[]) => this.props.dispatchRequest({ids}, Api.transactions, 'DELETE');
    handleRequestUpdate = (data: Partial<TransactionModel>[]) =>
        this.props.dispatchRequest({data}, Api.transactions, 'PUT');
    handleRequestCreate = (data: Omit<TransactionModel, 'id'>[]) =>
        this.props.dispatchRequest({data}, Api.transactions, 'POST');

    sanitizeItem = (item: TransactionModel) =>
        formToModel(modelToForm(item), {
            user: this.props.user.user,
        });

    copyItem = (item: TransactionModel): Omit<TransactionModel, 'id'> => {
        const copy = this.sanitizeItem(item);

        // @ts-ignore
        delete copy.id;

        return copy;
    };

    handleDuplicate = async () => {
        const selectedItems = this.selectedItems;

        await this.handleRequestCreate(
            selectedItems.map((each) => {
                const res = this.copyItem(each);

                res.status = TransactionStatus.pending;

                return res;
            }),
        );

        this.props.dispatch(onRefreshWidgets());
    };

    handleClickDraft = () => this.updateSelectedRecords({status: TransactionStatus.draft});
    handleClickReviewed = () => this.updateSelectedRecords({status: TransactionStatus.finished});
    handleClickNeedsReview = () => this.updateSelectedRecords({status: TransactionStatus.pending});
    handleClickHide = () =>
        this.updateSelectedRecords({
            hidden: true,
            status: TransactionStatus.finished,
        });
    handleClickUnhide = () => this.updateSelectedRecords({hidden: false});
    handleMerge = async () => {
        const items = this.selectedItems;
        const [first, ...rest] = items;
        const merged = mergeTransactions(items);

        if (merged) {
            await this.handleRequestUpdate([{id: first.id, ...merged}]);
            await this.handleRequestDelete(rest.map((each) => each.id));

            this.props.dispatch(onRefreshWidgets());
        }
    };
    handleTransactionRepeat = async (api: string) => {
        const ids = this.selectedItems.reduce((acc, item) => {
            if (item.repeat != null) {
                acc.push(item.id);
            }

            return acc;
        }, [] as number[]);

        if (ids.length) {
            await this.props.dispatchRequest({ids}, api, 'POST');

            this.props.dispatch(onRefreshWidgets());
        }
    };
    handleDetach = () => this.handleTransactionRepeat(Api.transactionsDetach);
    handleSkip = () => this.handleTransactionRepeat(Api.transactionsSkip);

    getContextMenuItemsProps(): TypeContextMenuItemsProps {
        return {
            selectedIds: this.props.transactionsState.selectedIds,
            onClickEdit: this.handleToggleEditDialog,
            onClickDelete: this.handleToggleDeleteDialog,
            onClickDuplicate: this.handleDuplicate,
            onClickDetach: this.handleDetach,
            onClickSkip: this.handleSkip,
            onClickMerge: this.handleMerge,
            onCloseContextMenu: this.handleCloseContextMenu,

            onClickDraft: this.handleClickDraft,
            onClickReviewed: this.handleClickReviewed,
            onClickNeedsReview: this.handleClickNeedsReview,

            onClickHide: this.handleClickHide,
            onClickUnhide: this.handleClickUnhide,
        };
    }

    setParam(param: QueryParam, value: string | null) {
        const {history} = this.props;
        const {location} = history;
        const searchParams = new URLSearchParams(location.search);

        searchParams.delete(QueryParam.page);

        if (value !== null) {
            searchParams.set(param, value);
        } else {
            searchParams.delete(param);
        }

        history.push({
            ...location,
            search: searchParams.toString(),
        });
    }

    handleFilteredChange: FilteredChangeFunction = (value) => {
        const filters = value.filter((f) => f.value != null);

        this.setParam(QueryParam.filters, filters.length ? JSON.stringify(filters) : null);
    };

    handlePageChange: PageChangeFunction = (value) => this.setParam(QueryParam.page, (value + 1).toString());

    handlePageSizeChange: PageSizeChangeFunction = (value) => this.setParam(QueryParam.pageSize, value.toString());

    handleSortedChange: SortedChangeFunction = (value) => this.setParam(QueryParam.sorters, JSON.stringify(value));

    renderContent() {
        const params = this.props.params;

        if (this.props.isDesktop) {
            const results = this.state.results;
            const count = results.length;

            return (
                <Paper>
                    {this.renderTableHeader()}
                    <div>
                        <BaseTable<TransactionModel>
                            filtered={params.filters}
                            onFilteredChange={this.handleFilteredChange}
                            sorted={params.sorters}
                            onSortedChange={this.handleSortedChange}
                            defaultSortDesc={true}
                            pageSize={params.pageSize}
                            onPageSizeChange={this.handlePageSizeChange}
                            page={params.page - 1}
                            onPageChange={this.handlePageChange}
                            pages={count >= params.pageSize ? params.page + 1 : params.page}
                            manual={true}
                            data={results}
                            columns={TransactionsColumns}
                            getTrProps={this.getTrProps}
                            getTdProps={getTdProps}
                        />
                    </div>
                    <Menu
                        open={this.state.contextMenuDisplay}
                        anchorReference="anchorPosition"
                        anchorPosition={{
                            top: this.state.contextMenuTop,
                            left: this.state.contextMenuLeft,
                        }}
                        onClose={this.handleCloseContextMenu}
                    >
                        <ContextMenuItems {...this.getContextMenuItemsProps()} />
                    </Menu>

                    <MainScreenEditDialog
                        variant="popover"
                        fieldToEdit={this.props.transactionsState.fieldToEdit}
                        popoverProps={{
                            anchorEl: this.props.transactionsState.editorAnchorEl,
                        }}
                        onClose={() => {
                            this.props.transactionsSetState({editorAnchorEl: null});
                        }}
                        {...this.getTransactionEditorProps()}
                    />
                </Paper>
            );
        }

        return (
            <>
                <TransactionsMobileHeader onTransactionAdd={this.handleToggleAddModal} />
                {Object.entries(this.getGroupedResults()).map(([date, items]) => (
                    <MainScreenListGroup
                        key={date}
                        date={date}
                        items={items}
                        itemProps={{
                            entityName: entityName,
                            contentComponent: ExpenseListItemContent,
                            contextMenuItemsProps: this.getContextMenuItemsProps(),
                            onReceiveSelectedIds: this.handleReceivedSelectedIds,
                        }}
                    />
                ))}
            </>
        );
    }

    renderDialogs() {
        return (
            <>
                <MainScreenCreatorDialog
                    onSave={() => {
                        this.props.dispatch(onRefreshWidgets());
                        this.handleToggleAddModal();
                    }}
                    onCancel={this.handleToggleAddModal}
                    open={this.state.addModalOpen}
                    onRequestCreate={this.handleRequestCreate}
                    entityName={entityName}
                />
                <MainScreenDeleteDialog
                    open={this.state.deleteDialogOpen}
                    onYes={this.handleDelete}
                    onNo={this.handleToggleDeleteDialog}
                    entityName={entityName}
                    count={Object.values(this.props.transactionsState.selectedIds).filter(Boolean).length}
                />
                <MainScreenEditDialog
                    variant="drawer"
                    drawerProps={{
                        open: this.state.editDialogOpen,
                    }}
                    onClose={this.handleToggleEditDialog}
                    {...this.getTransactionEditorProps()}
                />
            </>
        );
    }

    getTransactionEditorProps(): Pick<TransactionEditorProps, 'entityName' | 'items' | 'onSave' | 'onRequestUpdate'> {
        return {
            entityName,
            items: this.selectedItems,
            onSave: () => {
                this.props.dispatch(onRefreshWidgets());
            },
            onRequestUpdate: this.handleRequestUpdate,
        };
    }

    render() {
        return (
            <div>
                {this.renderContent()}
                {this.renderDialogs()}
            </div>
        );
    }
}

export const Transactions = (ownProps: TypeOwnProps) => {
    const stateProps = useSelector(({refreshWidgets, currencies, moneyLocations, user}: GlobalState) => ({
        refreshWidgets,
        currencies,
        moneyLocations,
        user,
    }));
    const dispatch = useDispatch();
    const [endDate] = useEndDate();
    const history = useHistory();

    const project = useSelectedProject();
    const isLarge = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
    const [transactionsState, setState] = useState<TTransactionsContext['state']>(TransactionsContextDefaultState);
    const transactionsSetState: TTransactionsContext['setState'] = useCallback(
        (values) => {
            setState((prevState) => ({
                ...prevState,
                ...(typeof values === 'function' ? values(prevState) : values),
            }));
        },
        [setState],
    );
    const {loading, firstLoad} = transactionsState;

    const params = useTransactionsParams();
    const dispatchRequest: TTransactionsContext['dispatchRequest'] = useCallback(
        (data, api, method) => {
            transactionsSetState((state) => ({loading: state.loading + 1}));

            const promise = createXHR({
                url: makeUrl(api, {projectId: project.id}),
                method,
                data,
            });

            promise.finally(() => {
                transactionsSetState((state) => ({loading: state.loading - 1}));
            });

            return promise;
        },
        [project.id],
    );

    return (
        <TransactionsContext.Provider
            value={{
                state: transactionsState,
                setState: transactionsSetState,
                dispatchRequest,
            }}
        >
            {!isLarge && firstLoad ? (
                <BigLoader />
            ) : (
                <>
                    <MainScreenListWrapped
                        {...stateProps}
                        {...ownProps}
                        endDate={endDate}
                        history={history}
                        dispatch={dispatch}
                        params={params}
                        project={project}
                        isDesktop={isLarge}
                        transactionsState={transactionsState}
                        transactionsSetState={transactionsSetState}
                        dispatchRequest={dispatchRequest}
                    />
                    {loading > 0 && <LinearProgress />}
                    <TransactionsScrollListener />
                </>
            )}
        </TransactionsContext.Provider>
    );
};
