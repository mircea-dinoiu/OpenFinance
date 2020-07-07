import {
    Button,
    ButtonProps,
    Checkbox,
    Fab,
    FormControlLabel,
    Menu,
    Paper,
} from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import AddIcon from '@material-ui/icons/Add';
import IconSplit from '@material-ui/icons/CallSplitRounded';
import IconStar from '@material-ui/icons/Star';
import IconStarBorder from '@material-ui/icons/StarBorder';
import {BaseTable, TableFooter, TableHeader} from 'components/BaseTable';
import {numericValue} from 'components/formatters';

import {BigLoader} from 'components/loaders';
import {ContextMenuItems} from 'components/MainScreen/ContextMenu/ContextMenuItems';
import {getTrProps} from 'components/MainScreen/Table/helpers';
import {Tooltip} from 'components/Tooltip';
import {WeightDisplay} from 'components/transactions/cells/WeightDisplay';
import {
    mapItemToDetachedUpdates,
    mapItemToRepeatedUpdates,
    mergeItems,
} from 'components/transactions/helpers';
import {LoadMore} from 'components/transactions/LoadMore';
import {MainScreenCreatorDialog} from 'components/transactions/MainScreenCreatorDialog';
import {MainScreenDeleteDialog} from 'components/transactions/MainScreenDeleteDialog';
import {MainScreenEditDialog} from 'components/transactions/MainScreenEditDialog';
import {MainScreenListGroup} from 'components/transactions/MainScreenListGroup';
import {SplitAmountField} from 'components/transactions/SplitAmountField';
import {StatsTable} from 'components/transactions/StatsTable';
import {TransactionStatus} from 'defs';
import {greyedOut} from 'defs/styles';
import {QueryParam} from 'defs/url';
import {mapUrlToFragment} from 'helpers';
import {convertCurrencyToDefault} from 'helpers/currency';
import * as H from 'history';
import {advanceRepeatDate} from 'js/helpers/repeatedModels';
import {isEqual, range, uniqueId} from 'lodash';
import groupBy from 'lodash/groupBy';
import moment from 'moment';
import React, {PureComponent, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory, useLocation} from 'react-router-dom';
import {Filter, SortingRule} from 'react-table-6';
import {Dispatch} from 'redux';
import {refreshWidgets as onRefreshWidgets} from 'state/actionCreators';
import {
    Accounts,
    Currencies,
    GlobalState,
    ScreenQueries,
    TransactionForm,
    TransactionModel,
    Users,
} from 'types';
import {useEndDate} from 'utils/dates';

import {createXHR} from 'utils/fetch';
import {makeUrl} from 'utils/url';

type TypeProps = {
    history: H.History;
    params: {
        pageSize: number;
        page: number;
        sorters: SortingRule[];
        filters: Filter[];
    };
    api: string;
    endDate: string;
    entityName: string;
    nameProperty: string;
    screen: ScreenQueries;
    crudProps: {
        // todo consider having stronger types here
        modelToForm: (model: TransactionModel) => TransactionForm;
        formToModel: (
            model: TransactionForm,
            detail: {user: Users},
        ) => TransactionModel;
        formComponent: React.ComponentType<{
            initialValues: TransactionForm;
            onFormChange: (TypeTransactionForm) => void;
        }>;
        getFormDefaults: () => TransactionForm;
    };
    tableColumns: (props: {
        updateRecords: (ids: number[], data: TransactionModel) => unknown;
    }) => Array<{}>;
    contentComponent: React.PureComponent<any>;
    currencies: Currencies;
    newRecord: {
        id: number;
        repeat: string;
    };
    refreshWidgets: string;
    defaultSorters: Array<{id: string; desc: boolean}>;
    dispatch: Dispatch;
    moneyLocations: Accounts;
    user: Users;
};

type TypeState = {
    firstLoad: boolean;
    results: TransactionModel[];
    loading: number;
    refreshing: boolean;
    selectedIds: number[];

    addModalOpen: boolean;
    editDialogOpen: boolean;
    editDialogKey: string;
    deleteDialogOpen: boolean;
    displayHidden: boolean;
    splitAmount: string;

    contextMenuDisplay: boolean;
    contextMenuLeft: number;
    contextMenuTop: number;
};

class MainScreenListWrapped extends PureComponent<TypeProps, TypeState> {
    state: TypeState = {
        firstLoad: true,
        results: [],
        loading: 0,
        refreshing: false,
        selectedIds: [],
        contextMenuDisplay: false,
        contextMenuTop: 0,
        contextMenuLeft: 0,

        addModalOpen: false,
        editDialogOpen: false,
        editDialogKey: uniqueId(),
        deleteDialogOpen: false,

        displayHidden: false,
        splitAmount: '',
    };

    componentDidMount() {
        this.loadMore();
    }

    handleReceiveNewRecord(newRecord) {
        if (
            newRecord &&
            this.state.results.filter(
                (each: {id: number}) => each.id == newRecord.id,
            ).length === 0
        ) {
            this.setState({
                results: this.state.results.concat(newRecord),
            });

            this.props.dispatch(onRefreshWidgets());
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.refreshWidgets !== this.props.refreshWidgets) {
            this.refresh();
        } else if (prevProps.endDate !== this.props.endDate) {
            this.refresh();
        } else if (!isEqual(prevProps.params, this.props.params)) {
            this.refresh();
        }
    }

    handleToggleDeleteDialog = () =>
        this.setState((state) => ({deleteDialogOpen: !state.deleteDialogOpen}));
    handleToggleEditDialog = () =>
        this.setState((state) => ({
            editDialogOpen: !state.editDialogOpen,
            editDialogKey: uniqueId(),
        }));
    handleToggleAddModal = () =>
        this.setState((state) => ({
            addModalOpen: !state.addModalOpen,
        }));

    handleDelete = async () => {
        this.handleToggleDeleteDialog();

        await this.handleRequestDelete(
            this.selectedItems.map((each: {id: number}) => ({id: each.id})),
        );

        this.props.dispatch(onRefreshWidgets());
    };

    handleUpdate = () => {
        this.handleToggleEditDialog();
        this.props.dispatch(onRefreshWidgets());
    };

    get hasFiltersSet() {
        return (
            this.props.params.filters.filter((each) => each.value.text !== '')
                .length > 0
        );
    }

    get displayArchived() {
        return this.state.displayHidden || this.hasFiltersSet;
    }

    loadMore = async ({results = this.state.results} = {}) => {
        const infiniteScroll = !this.isDesktop();

        if (this.state.loading) {
            return;
        }

        this.handleCloseContextMenu();

        const {pageSize, sorters, filters, page} = this.props.params;

        this.setState((state) => ({loading: state.loading + 1}));

        const response = await createXHR<TransactionModel[]>({
            url: makeUrl(this.props.api, {
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
            }),
        });
        const json = response.data;
        const nextResults = infiniteScroll ? results.concat(json) : json;

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

        return groupBy(results, (each) =>
            moment(each.created_at).format('YYYY-MM-DD'),
        );
    }

    refresh = async () => {
        this.setState({
            refreshing: true,
        });

        await this.loadMore({
            results: [],
        });

        this.setState({
            refreshing: false,
        });
    };

    getCommonProps() {
        return {
            api: this.props.api,
            entityName: this.props.entityName,
            nameProperty: this.props.nameProperty,
            crudProps: this.props.crudProps,
        };
    }

    isDesktop() {
        return this.props.screen.isLarge;
    }

    handleReceivedSelectedIds = (selectedIds: number[]) =>
        this.setState({selectedIds});
    handleChangeContextMenu = ({
        display,
        top = 0,
        left = 0,
    }: {
        display: boolean;
        top?: number;
        left?: number;
    }) =>
        this.setState({
            contextMenuDisplay: display,
            contextMenuTop: top,
            contextMenuLeft: left,
        });

    getTrProps = (state, item) =>
        item
            ? getTrProps({
                  selectedIds: this.state.selectedIds,
                  onEdit: this.handleToggleEditDialog,
                  onReceiveSelectedIds: this.handleReceivedSelectedIds,
                  onChangeContextMenu: this.handleChangeContextMenu,
                  item: item.original,
              })
            : {};

    get selectedItems() {
        return this.state.results.filter((r) =>
            this.state.selectedIds.includes(r.id),
        );
    }

    computeAmount(items) {
        const mlIdToCurrencyId = this.props.moneyLocations.reduce(
            (acc, each) => {
                acc[each.id] = each.currency_id;

                return acc;
            },
            {},
        );

        return items.reduce((acc, each) => {
            const sum = convertCurrencyToDefault(
                each.sum,
                mlIdToCurrencyId[each.money_location_id],
                this.props.currencies,
            );

            return acc + sum;
        }, 0);
    }

    computeWeight(items) {
        return items.reduce((acc, each) => acc + (each.weight || 0), 0);
    }

    handleSelectAll = (event) => {
        event.preventDefault();

        this.handleReceivedSelectedIds(this.state.results.map((r) => r.id));
    };

    renderTableHeader() {
        const buttonProps: ButtonProps = {
            size: 'small',
            style: {
                height: '32px',
                marginTop: '10px',
            },
        };

        return (
            <TableHeader columnCount={6}>
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
                        error={isNaN(
                            this.parseSplitAmount(this.state.splitAmount),
                        )}
                        placeholder="Split"
                        value={this.state.splitAmount}
                        onChange={this.handleChangeSplitAmount}
                        margin="normal"
                        variant="outlined"
                        InputProps={{
                            style: {
                                height: '32px',
                            },
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={this.handleClickSplit}
                                        disabled={!this.isSplitAmountValid()}
                                    >
                                        <IconSplit />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </>
                <Button
                    variant="outlined"
                    onClick={this.handleSelectAll}
                    {...buttonProps}
                >
                    Select All
                </Button>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={this.handleToggleAddModal}
                    {...buttonProps}
                >
                    Create transaction
                </Button>
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

        return (
            selectedItems.length >= 1 &&
            selectedItems.every((each) => Math.abs(each.sum) > Math.abs(amount))
        );
    }

    parseSplitAmount(number) {
        const working = number.trim();

        if (!working) {
            return 0;
        }

        return Number(working);
    }

    handleChangeSplitAmount = (event) => {
        this.setState({splitAmount: event.target.value});
    };

    handleClickSplit = async () => {
        const selectedItems = this.selectedItems;
        const splitBy = this.parseSplitAmount(this.state.splitAmount);

        await this.handleRequestCreate(
            selectedItems.map((each) => {
                const res = this.copyItem(each);
                const sign = res.sum < 0 ? -1 : 1;

                res.sum = sign * splitBy;

                return res;
            }),
        );

        await this.handleRequestUpdate(
            selectedItems.map((each) => {
                const sign = each.sum < 0 ? -1 : 1;
                const splittedAmount = sign * (Math.abs(each.sum) - splitBy);

                return {
                    ...each,
                    sum: Math.round(splittedAmount * 100) / 100,
                };
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

    renderStats(head, items) {
        return (
            <div style={{display: 'inline-block', marginRight: 5}}>
                <Tooltip
                    tooltip={
                        <StatsTable>
                            <tbody>
                                <tr>
                                    <th>Balance:</th>
                                    <td>
                                        {numericValue(
                                            this.computeAmount(items),
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Weight:</th>
                                    <td>
                                        <WeightDisplay
                                            item={{
                                                weight: this.computeWeight(
                                                    items,
                                                ),
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

    renderTableFooter() {
        const page = this.state.results;
        const selected = this.selectedItems;

        return (
            <TableFooter>
                {this.renderStats('Current Page', page)}
                {this.renderStats('Selected', selected)}
                {range(0, 6).map((rating) =>
                    this.renderStats(
                        <React.Fragment>
                            {rating === 0 ? (
                                <IconStarBorder
                                    style={{height: 20, width: 20}}
                                />
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
                            rating === 0
                                ? each.favorite == null || each.favorite === 0
                                : each.favorite === rating,
                        ),
                    ),
                )}
            </TableFooter>
        );
    }

    handleCloseContextMenu = () =>
        this.handleChangeContextMenu({display: false});

    updateRecords = async (ids, data) => {
        try {
            await this.handleRequestUpdate(ids.map((id) => ({id, ...data})));

            this.props.dispatch(onRefreshWidgets());
        } catch (e) {
            console.error(e);
            // todo
        }
    };

    updateSelectedRecords = (data) =>
        this.updateRecords(
            this.selectedItems.map((each) => each.id),
            data,
        );

    withLoading = (fn) => async (...args: any[]) => {
        this.setState((state) => ({loading: state.loading + 1}));

        const promise = fn(...args);

        promise.finally(() => {
            this.setState((state) => ({loading: state.loading - 1}));
        });

        return await promise;
    };

    handleRequest = this.withLoading((data, api: string, method) =>
        createXHR({
            url: api,
            method,
            data: {data},
        }),
    );
    handleRequestDelete = (data) =>
        this.handleRequest(data, this.props.api, 'DELETE');
    handleRequestUpdate = (data) =>
        this.handleRequest(data, this.props.api, 'PUT');
    handleRequestCreate = (data) =>
        this.handleRequest(data, this.props.api, 'POST');

    sanitizeItem = (item) =>
        this.props.crudProps.formToModel(
            this.props.crudProps.modelToForm(item),
            {user: this.props.user},
        );

    copyItem = (item) => {
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

    handleClickDraft = () =>
        this.updateSelectedRecords({status: TransactionStatus.draft});
    handleClickReviewed = () =>
        this.updateSelectedRecords({status: TransactionStatus.finished});
    handleClickNeedsReview = () =>
        this.updateSelectedRecords({status: TransactionStatus.pending});
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
            await this.handleRequestDelete(rest.map((each) => ({id: each.id})));

            this.props.dispatch(onRefreshWidgets());
        }
    };
    handleDetach = async () => {
        const added = [];
        const updated = [];
        const promises = [];

        this.selectedItems.forEach((item) => {
            if (item.repeat != null) {
                const extra = mapItemToRepeatedUpdates(item);

                added.push(
                    this.copyItem(advanceRepeatDate({...item, ...extra})),
                );
                updated.push(mapItemToDetachedUpdates(item));
            }
        });

        if (added.length) {
            promises.push(this.handleRequestCreate(added));
        }

        if (updated.length) {
            promises.push(this.handleRequestUpdate(updated));
        }

        if (promises.length) {
            await Promise.all(promises);

            this.props.dispatch(onRefreshWidgets());
        }
    };

    getContextMenuItemsProps() {
        return {
            selectedIds: this.state.selectedIds,
            onClickEdit: this.handleToggleEditDialog,
            onClickDelete: this.handleToggleDeleteDialog,
            onClickDuplicate: this.handleDuplicate,
            onClickDetach: this.handleDetach,
            onClickMerge: this.handleMerge,
            onCloseContextMenu: this.handleCloseContextMenu,

            onClickDraft: this.handleClickDraft,
            onClickReviewed: this.handleClickReviewed,
            onClickNeedsReview: this.handleClickNeedsReview,

            onClickHide: this.handleClickHide,
            onClickUnhide: this.handleClickUnhide,
        };
    }

    setParam(param: QueryParam, value: string) {
        const url = new URL(window.location.href);

        url.searchParams.delete(QueryParam.page);
        url.searchParams.set(
            param,
            value,
        );
        this.props.history.push(
            mapUrlToFragment(url),
        );
    }

    renderContent() {
        const commonProps = this.getCommonProps();
        const params = this.props.params;

        if (this.isDesktop()) {
            const results = this.getSortedResults();
            const count = results.length;

            return (
                <Paper>
                    {this.renderTableHeader()}
                    <div>
                        <BaseTable<TransactionModel>
                            filtered={params.filters}
                            onFilteredChange={(value) => this.setParam(QueryParam.filters, JSON.stringify(value))}

                            sorted={params.sorters}
                            onSortedChange={(value) => this.setParam(QueryParam.sorters, JSON.stringify(value))}
                            defaultSortDesc={true}

                            pageSize={params.pageSize}
                            onPageSizeChange={value => this.setParam(QueryParam.pageSize, value.toString())}

                            page={params.page - 1}
                            onPageChange={value => this.setParam(QueryParam.page, (value + 1).toString())}

                            pages={
                                count >= params.pageSize
                                    ? params.page + 1
                                    : params.page
                            }
                            showPagination={true}
                            showPageSizeOptions={true}
                            manual={true}
                            loading={this.state.loading > 0}
                            data={results}
                            columns={this.props.tableColumns({
                                updateRecords: this.updateRecords,
                            })}
                            getTrProps={this.getTrProps}
                        />
                    </div>
                    {this.renderTableFooter()}
                    <Menu
                        open={this.state.contextMenuDisplay}
                        anchorReference="anchorPosition"
                        anchorPosition={{
                            top: this.state.contextMenuTop,
                            left: this.state.contextMenuLeft,
                        }}
                        onClose={this.handleCloseContextMenu}
                    >
                        <ContextMenuItems
                            {...this.getContextMenuItemsProps()}
                        />
                    </Menu>
                </Paper>
            );
        }

        return Object.entries(this.getGroupedResults()).map(([date, items]) => (
            <MainScreenListGroup
                key={date}
                date={date}
                items={items}
                itemProps={{
                    ...commonProps,
                    contentComponent: this.props.contentComponent,
                    contextMenuItemsProps: this.getContextMenuItemsProps(),
                    onReceiveSelectedIds: this.handleReceivedSelectedIds,
                }}
            />
        ));
    }

    renderDialogs() {
        const selectedItems = this.selectedItems;

        return (
            <>
                <MainScreenCreatorDialog
                    onReceiveNewRecord={(newRecord) => {
                        this.handleReceiveNewRecord(newRecord);
                        this.handleToggleAddModal();
                    }}
                    onCancel={this.handleToggleAddModal}
                    open={this.state.addModalOpen}
                    onRequestCreate={this.handleRequestCreate}
                    entityName={this.props.entityName}
                    {...this.props.crudProps}
                />
                <MainScreenDeleteDialog
                    open={this.state.deleteDialogOpen}
                    onYes={this.handleDelete}
                    onNo={this.handleToggleDeleteDialog}
                    entityName={this.props.entityName}
                    count={
                        Object.values(this.state.selectedIds).filter(Boolean)
                            .length
                    }
                />
                {selectedItems.length > 0 && (
                    <MainScreenEditDialog
                        key={this.state.editDialogKey}
                        open={this.state.editDialogOpen}
                        items={selectedItems}
                        onCancel={this.handleToggleEditDialog}
                        onSave={this.handleUpdate}
                        entityName={this.props.entityName}
                        onRequestUpdate={this.handleRequestUpdate}
                        user={this.props.user}
                        {...this.props.crudProps}
                    />
                )}
            </>
        );
    }

    render() {
        if (!this.isDesktop() && this.state.firstLoad) {
            return <BigLoader />;
        }

        const {loading} = this.state;
        const isDesktop = this.isDesktop();

        return (
            <div>
                <div
                    style={{
                        ...(this.state.refreshing && !isDesktop
                            ? greyedOut
                            : {}),
                    }}
                >
                    {this.renderContent()}
                    {isDesktop ? null : (
                        <LoadMore
                            loading={loading}
                            onClick={() => {
                                const url = new URL(window.location.search);

                                url.searchParams.set(
                                    QueryParam.page,
                                    String(this.props.params.page + 1),
                                );
                                this.props.history.replace(
                                    mapUrlToFragment(url),
                                );
                            }}
                        />
                    )}
                    {this.renderDialogs()}
                    {!isDesktop && (
                        <Fab
                            variant="extended"
                            color="primary"
                            onClick={this.handleToggleAddModal}
                            style={{
                                position: 'fixed',
                                bottom: '70px',
                                right: '10px',
                                zIndex: 1,
                            }}
                        >
                            <AddIcon />
                        </Fab>
                    )}
                </div>
            </div>
        );
    }
}

export const MainScreenList = (ownProps) => {
    const stateProps = useSelector(
        ({
            screen,
            refreshWidgets,
            currencies,
            moneyLocations,
            user,
        }: GlobalState) => ({
            screen,
            refreshWidgets,
            currencies,
            moneyLocations,
            user,
        }),
    );
    const dispatch = useDispatch();
    const [endDate] = useEndDate();
    const history = useHistory();
    const location = useLocation();

    const params = useMemo(() => {
        const searchParams = new URLSearchParams(location.search);

        return {
            pageSize: JSON.parse(searchParams.get(QueryParam.pageSize)) ?? 50,
            page: JSON.parse(searchParams.get(QueryParam.page)) ?? 1,
            sorters: JSON.parse(searchParams.get(QueryParam.sorters)) ?? [
                {id: 'created_at', desc: true},
            ],
            filters: JSON.parse(searchParams.get(QueryParam.filters)) ?? [],
        };
    }, [location.search]);

    return (
        <MainScreenListWrapped
            {...ownProps}
            {...stateProps}
            endDate={endDate}
            history={history}
            dispatch={dispatch}
            params={params}
        />
    );
};
