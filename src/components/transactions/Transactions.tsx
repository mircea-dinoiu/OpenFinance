import {
    Button,
    Checkbox,
    Fab,
    FormControlLabel,
    LinearProgress,
    Menu,
    Paper, Theme,
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
import {BaseTable, TableHeader, TableHeaderTop} from 'components/BaseTable';

import {BigLoader} from 'components/loaders';
import {ContextMenuItems} from 'components/MainScreen/ContextMenu/ContextMenuItems';
import {getTrProps} from 'components/MainScreen/Table/helpers';
import {Tooltip} from 'components/Tooltip';
import {WeightDisplay} from 'components/transactions/cells/WeightDisplay';
import {ExpenseForm} from 'components/transactions/ExpenseForm';
import {ExpenseListItemContent} from 'components/transactions/ExpenseListItemContent';
import {makeTransactionsColumns} from 'components/transactions/ExpenseTableColumns';
import {mergeItems} from 'components/transactions/helpers';
import {ImportTransactions} from 'components/transactions/ImportTransactions';
import {MainScreenCreatorDialog} from 'components/transactions/MainScreenCreatorDialog';
import {MainScreenDeleteDialog} from 'components/transactions/MainScreenDeleteDialog';
import {MainScreenEditDialog} from 'components/transactions/MainScreenEditDialog';
import {MainScreenListGroup} from 'components/transactions/MainScreenListGroup';
import {SplitAmountField} from 'components/transactions/SplitAmountField';
import {StatsTable} from 'components/transactions/StatsTable';
import {SummaryTotal} from 'components/transactions/SummaryTotal';
import {TransactionsEndDatePicker} from 'components/transactions/TransactionsEndDatePicker';
import {TransactionsMobileHeader} from 'components/transactions/TransactionsMobileHeader';
import {formToModel} from 'components/transactions/transformers/formToModel';
import {modelToForm} from 'components/transactions/transformers/modelToForm';
import {TransactionModel, UpdateRecords} from 'components/transactions/types';
import {TransactionStatus} from 'defs';
import {Api} from 'defs/Api';
import {spacingSmall} from 'defs/styles';
import {QueryParam} from 'defs/url';
import * as H from 'history';
import _, {isEqual, range} from 'lodash';
import groupBy from 'lodash/groupBy';
import moment from 'moment';
import React, {PureComponent, ReactNode, useMemo} from 'react';
import EventListener from 'react-event-listener';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory, useLocation} from 'react-router-dom';
import {Filter, SortingRule} from 'react-table-6';
import {Dispatch} from 'redux';
import {refreshWidgets as onRefreshWidgets} from 'state/actionCreators';
import {Project, useSelectedProject} from 'state/projects';
import {Accounts, Bootstrap, CurrencyMap, GlobalState} from 'types';
import {useEndDate} from 'utils/dates';

import {createXHR, HttpMethod} from 'utils/fetch';
import {scrollReachedBottom} from 'utils/scroll';
import {makeUrl, mapUrlToFragment} from 'utils/url';

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
    currencies: CurrencyMap;
    refreshWidgets: string;
    dispatch: Dispatch;
    moneyLocations: Accounts;
    user: Bootstrap;
    project: Project;
} & TypeOwnProps;

type TypeState = {
    firstLoad: boolean;
    results: TransactionModel[];
    loading: number;
    selectedIds: number[];

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
const crudProps = {
    modelToForm,
    formToModel,
    formComponent: ExpenseForm,
};

class MainScreenListWrapped extends PureComponent<TypeProps, TypeState> {
    state: TypeState = {
        firstLoad: true,
        results: [],
        loading: 0,
        selectedIds: [],
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
        if (this.state.loading) {
            return;
        }

        this.handleCloseContextMenu();

        const {sorters, filters} = this.props.params;

        this.setState((state) => ({loading: state.loading + 1}));

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

        this.setState((state) => ({
            results: nextResults,
            firstLoad: false,
            loading: state.loading - 1,
        }));
    };

    getSortedResults() {
        return this.state.results;
    }

    getGroupedResults() {
        const results = this.getSortedResults();

        return groupBy(results, (each) => moment(each.created_at).format('YYYY-MM-DD'));
    }

    refresh = async () => {
        await this.loadMore({
            results: [],
            page: 1,
            pageSize: this.props.params.page * this.props.params.pageSize,
        });
    };

    handleReceivedSelectedIds = (selectedIds: number[]) => this.setState({selectedIds});
    handleChangeContextMenu = ({display, top = 0, left = 0}: {display: boolean; top?: number; left?: number}) =>
        this.setState({
            contextMenuDisplay: display,
            contextMenuTop: top,
            contextMenuLeft: left,
        });

    getTrProps = (state: any, rowInfo?: {original: TransactionModel}) =>
        rowInfo
            ? getTrProps({
                  selectedIds: this.state.selectedIds,
                  onEdit: this.handleToggleEditDialog,
                  onReceiveSelectedIds: this.handleReceivedSelectedIds,
                  onChangeContextMenu: this.handleChangeContextMenu,
                  item: rowInfo.original,
              })
            : {};

    get selectedItems() {
        return this.state.results.filter((r) => this.state.selectedIds.includes(r.id));
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
                        <div style={{marginTop: spacingSmall}}>
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
                        </div>
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

    updateRecords: UpdateRecords = async (ids, data) => {
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

    withLoading = <Fn extends Function>(fn: Fn) => async (...args: any[]) => {
        this.setState((state) => ({loading: state.loading + 1}));

        const promise = fn(...args);

        promise.finally(() => {
            this.setState((state) => ({loading: state.loading - 1}));
        });

        return await promise;
    };

    handleRequest = this.withLoading(<D,>(data: D, api: string, method: HttpMethod) =>
        createXHR({
            url: makeUrl(api, {projectId: this.props.project.id}),
            method,
            data,
        }),
    );
    handleRequestDelete = (ids: number[]) => this.handleRequest({ids}, Api.transactions, 'DELETE');
    handleRequestUpdate = (data: Partial<TransactionModel>[]) => this.handleRequest({data}, Api.transactions, 'PUT');
    handleRequestCreate = (data: Omit<TransactionModel, 'id'>[]) => this.handleRequest({data}, Api.transactions, 'POST');

    sanitizeItem = (item: TransactionModel) =>
        crudProps.formToModel(crudProps.modelToForm(item), {
            user: this.props.user,
        });

    copyItem = (item: TransactionModel): Omit<TransactionModel, 'id'> => {
        const copy = this.sanitizeItem(item);

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
        const merged = mergeItems(items);

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
            await this.handleRequest({ids}, api, 'POST');

            this.props.dispatch(onRefreshWidgets());
        }
    };
    handleDetach = () => this.handleTransactionRepeat(Api.transactionsDetach);
    handleSkip = () => this.handleTransactionRepeat(Api.transactionsSkip);

    getContextMenuItemsProps() {
        return {
            selectedIds: this.state.selectedIds,
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
        const url = new URL(window.location.href);

        url.searchParams.delete(QueryParam.page);

        if (value !== null) {
            url.searchParams.set(param, value);
        } else {
            url.searchParams.delete(param);
        }

        this.props.history.push(mapUrlToFragment(url));
    }

    columns = makeTransactionsColumns({
        updateRecords: this.updateRecords,
    });

    renderContent() {
        const params = this.props.params;

        if (this.props.isDesktop) {
            const results = this.getSortedResults();
            const count = results.length;

            return (
                <Paper>
                    {this.renderTableHeader()}
                    <div>
                        <BaseTable<TransactionModel>
                            filtered={params.filters}
                            onFilteredChange={(value) => {
                                const filters = value.filter((f) => f.value != null);

                                this.setParam(QueryParam.filters, filters.length ? JSON.stringify(filters) : null);
                            }}
                            sorted={params.sorters}
                            onSortedChange={(value) => this.setParam(QueryParam.sorters, JSON.stringify(value))}
                            defaultSortDesc={true}
                            pageSize={params.pageSize}
                            onPageSizeChange={(value) => this.setParam(QueryParam.pageSize, value.toString())}
                            page={params.page - 1}
                            onPageChange={(value) => this.setParam(QueryParam.page, (value + 1).toString())}
                            pages={count >= params.pageSize ? params.page + 1 : params.page}
                            manual={true}
                            data={results}
                            columns={this.columns}
                            getTrProps={this.getTrProps}
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
        const selectedItems = this.selectedItems;

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
                    {...crudProps}
                />
                <MainScreenDeleteDialog
                    open={this.state.deleteDialogOpen}
                    onYes={this.handleDelete}
                    onNo={this.handleToggleDeleteDialog}
                    entityName={entityName}
                    count={Object.values(this.state.selectedIds).filter(Boolean).length}
                />
                <MainScreenEditDialog
                    open={this.state.editDialogOpen}
                    items={selectedItems}
                    onCancel={this.handleToggleEditDialog}
                    onSave={() => {
                        this.handleToggleEditDialog();
                        this.props.dispatch(onRefreshWidgets());
                    }}
                    entityName={entityName}
                    onRequestUpdate={this.handleRequestUpdate}
                    user={this.props.user}
                    {...crudProps}
                />
            </>
        );
    }

    render() {
        if (!this.props.isDesktop && this.state.firstLoad) {
            return <BigLoader />;
        }

        return (
            <div>
                {this.renderContent()}
                {this.state.loading > 0 && <LinearProgress />}
                {this.renderDialogs()}

                <EventListener target="window" onScroll={this.handleWindowScroll} />
            </div>
        );
    }

    handleWindowScroll = () => {
        if (!this.state.loading && scrollReachedBottom(document.scrollingElement as HTMLElement)) {
            const url = new URL(window.location.href);

            url.searchParams.set(QueryParam.page, String(this.props.params.page + 1));
            this.props.history.replace(mapUrlToFragment(url));
        }
    };
}

export const Transactions = (ownProps: TypeOwnProps) => {
    const stateProps = useSelector(({ refreshWidgets, currencies, moneyLocations, user}: GlobalState) => ({
        refreshWidgets,
        currencies,
        moneyLocations,
        user,
    }));
    const dispatch = useDispatch();
    const [endDate] = useEndDate();
    const history = useHistory();
    const location = useLocation();
    const project = useSelectedProject();
    const isLarge = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

    const params = useMemo(() => {
        const searchParams = new URLSearchParams(location.search);

        return {
            pageSize: JSON.parse(searchParams.get(QueryParam.pageSize) as string) ?? 30,
            page: JSON.parse(searchParams.get(QueryParam.page) as string) ?? 1,
            sorters: JSON.parse(searchParams.get(QueryParam.sorters) as string) ?? [{id: 'created_at', desc: true}],
            filters: JSON.parse(searchParams.get(QueryParam.filters) as string) ?? [],
        };
    }, [location.search]);

    return (
        <MainScreenListWrapped
            {...stateProps}
            {...ownProps}
            endDate={endDate}
            history={history}
            dispatch={dispatch}
            params={params}
            project={project}
            isDesktop={isLarge}
        />
    );
};
