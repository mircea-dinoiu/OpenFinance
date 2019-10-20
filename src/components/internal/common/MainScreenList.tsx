import {
    TypeCurrencies,
    TypeDispatch,
    TypeGlobalState,
    TypeMoneyLocations,
    TypePreferences,
    TypeScreenQueries,
    TypeTransactionForm,
    TypeTransactionModel,
    TypeUsers,
} from 'types';
import {objectEntriesOfSameType, objectValuesOfSameType} from 'utils/collection';
import {mapItemToDetachedUpdates, mapItemToRepeatedUpdates, mergeItems} from 'components/internal/common/helpers';
import React, {PureComponent} from 'react';
import moment from 'moment';
import groupBy from 'lodash/groupBy';

import {BigLoader} from 'components/loaders';

import {createXHR} from 'utils/fetch';

import {Button, Checkbox, Fab, FormControlLabel} from '@material-ui/core';
import {useDispatch, useSelector} from 'react-redux';
import {greyedOut} from 'defs/styles';
import BaseTable, {TableFooter, TableHeader} from 'components/BaseTable';
import {getTrProps} from 'components/MainScreen/Table/helpers';
import MainScreenListGroup from 'components/internal/common/MainScreenListGroup';
import MainScreenCreatorDialog from './MainScreenCreatorDialog';
import {convertCurrencyToDefault} from 'helpers/currency';
import {numericValue} from 'components/formatters';
import {Sizes} from 'defs';
import AnchoredContextMenu from 'components/MainScreen/ContextMenu/AnchoredContextMenu';
import MainScreenDeleteDialog from './MainScreenDeleteDialog';
import MainScreenEditDialog from './MainScreenEditDialog';
import AddIcon from '@material-ui/icons/Add';
import {refreshWidgets as onRefreshWidgets} from 'state/actionCreators';
import {advanceRepeatDate} from 'js/helpers/repeatedModels';
import {range, uniqueId} from 'lodash';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import IconSplit from '@material-ui/icons/CallSplitRounded';
import Tooltip from 'components/Tooltip';
import Chip from '@material-ui/core/Chip';
import WeightDisplay from 'components/internal/expenses/cells/WeightDisplay';
import IconStar from '@material-ui/icons/Star';
import IconStarBorder from '@material-ui/icons/StarBorder';
import ContextMenuItems from 'components/MainScreen/ContextMenu/ContextMenuItems';
import {makeUrl} from 'utils/url';
import {StatsTable} from './StatsTable';
import {SplitAmountField} from './SplitAmountField';
import {LoadMore} from './LoadMore';

type TypeProps = {
    api: string;
    preferences: TypePreferences;
    entityName: string;
    nameProperty: string;
    screen: TypeScreenQueries;
    crudProps: {
        // todo consider having stronger types here
        modelToForm: (TypeTransactionModel) => TypeTransactionForm;
        formToModel: (
            TypeTransactionForm,
            {user: TypeUsers},
        ) => TypeTransactionModel;
        formComponent: React.ComponentType<{
            initialValues: TypeTransactionForm;
            onFormChange: (TypeTransactionForm) => void;
        }>;
        getFormDefaults: () => TypeTransactionForm;
    };
    tableColumns: (props: {
        updateRecords: (ids: number[], data: TypeTransactionModel) => unknown;
    }) => Array<{}>;
    contentComponent: React.PureComponent<any>;
    currencies: TypeCurrencies;
    newRecord: {
        id: number;
        repeat: string;
    };
    refreshWidgets: string;
    defaultSorters: Array<{id: string; desc: boolean}>;
    dispatch: TypeDispatch;
    moneyLocations: TypeMoneyLocations;
    user: TypeUsers;
};

type TypeState = {
    firstLoad: boolean;
    page: number;
    results: TypeTransactionModel[];
    loading: number;
    refreshing: boolean;
    selectedIds: {};

    addModalOpen: boolean;
    editDialogOpen: boolean;
    editDialogKey: string;
    deleteDialogOpen: boolean;
    splitAmount: string;

    contextMenuDisplay: boolean;
    contextMenuLeft: number;
    contextMenuTop: number;
};

class MainScreenList extends PureComponent<TypeProps, TypeState> {
    state = {
        firstLoad: true,
        page: 1,
        results: [],
        loading: 0,
        refreshing: false,
        selectedIds: {},
        contextMenuDisplay: false,
        contextMenuTop: 0,
        contextMenuLeft: 0,

        addModalOpen: false,
        editDialogOpen: false,
        editDialogKey: uniqueId(),
        deleteDialogOpen: false,

        pendingFirst: true,
        displayHidden: false,
        splitAmount: '',
    };
    sorters = [];
    filters = [];

    get pageSize() {
        return this.isDesktop() ? 200 : 50;
    }

    static defaultProps = {
        defaultSorters: [{id: 'created_at', desc: true}],
    };

    componentDidMount() {
        if (!this.isDesktop()) {
            this.loadMore();
        }
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

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps({preferences, refreshWidgets}) {
        if (refreshWidgets !== this.props.refreshWidgets) {
            this.refresh();
        }

        const {endDate} = preferences;

        if (endDate !== this.props.preferences.endDate) {
            this.refresh({endDate});
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
        return this.filters.filter((each) => each.value.text !== '').length > 0;
    }

    loadMore = async ({
        page = this.state.page,
        results = this.state.results,
        endDate = this.props.preferences.endDate,
    } = {}) => {
        const infiniteScroll = !this.isDesktop();

        if (this.state.loading) {
            return;
        }

        this.setState((state) => ({loading: state.loading + 1}));
        const sorters: {id: string; desc: boolean}[] = [];

        if (this.state.pendingFirst && this.isDesktop()) {
            sorters.push({id: 'status', desc: true});
        }

        this.sorters.forEach((sorter) => {
            sorters.push(sorter);
        });

        const response = await createXHR<TypeTransactionModel[]>({
            url: makeUrl(this.props.api, {
                end_date: endDate,
                page,
                limit: this.pageSize,
                sorters: JSON.stringify(sorters),
                filters: JSON.stringify(
                    [
                        this.state.displayHidden
                            ? null
                            : {
                                  id: 'hidden',
                                  value: false,
                              },
                        ...this.filters,
                    ].filter(Boolean),
                ),
            }),
        });
        const json = response.data;
        const nextResults = infiniteScroll ? results.concat(json) : json;

        this.setState((state) => ({
            page,
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

    refresh = async ({endDate = this.props.preferences.endDate} = {}) => {
        this.setState({
            refreshing: true,
        });

        await this.loadMore({
            page: this.isDesktop() ? this.state.page : 1,
            results: [],
            endDate,
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

    handleReceivedSelectedIds = (selectedIds) => this.setState({selectedIds});
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
        return this.state.results.filter((each) =>
            Boolean(this.state.selectedIds[each.id]),
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

        this.handleReceivedSelectedIds(
            this.state.results.reduce((acc, each: {id: number}) => {
                acc[each.id] = true;

                return acc;
            }, {}),
        );
    };

    renderTableHeader() {
        return (
            <TableHeader>
                <>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.state.pendingFirst}
                                onChange={this.handleTogglePendingFirst}
                                color="default"
                            />
                        }
                        label="Pending First"
                    />
                </>
                <>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.state.displayHidden}
                                onChange={this.handleToggleDisplayHidden}
                                color="default"
                            />
                        }
                        label="Display Archived"
                    />
                </>
                <>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={this.handleSelectAll}
                        style={{
                            height: '32px',
                            marginTop: '10px',
                        }}
                    >
                        Select All
                    </Button>
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
            selectedItems.every((each) => each.sum > amount)
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

                res.sum = splitBy;

                return res;
            }),
        );

        await this.handleRequestUpdate(
            selectedItems.map((each) => ({
                ...each,
                sum: Math.round((each.sum - splitBy) * 100) / 100,
            })),
        );

        this.props.dispatch(onRefreshWidgets());
    };

    handleToggleStateKey = (key: 'pendingFirst' | 'displayHidden') => () => {
        this.setState(
            // @ts-ignore
            (state) => ({
                [key]: !state[key],
            }),
            this.refresh,
        );
    };

    handleTogglePendingFirst = this.handleToggleStateKey('pendingFirst');
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
        this.updateRecords(this.selectedItems.map((each) => each.id), data);

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

                res.status = 'pending';

                return res;
            }),
        );

        this.props.dispatch(onRefreshWidgets());
    };

    handleClickReviewed = () =>
        this.updateSelectedRecords({status: 'finished'});
    handleClickNeedsReview = () =>
        this.updateSelectedRecords({status: 'pending'});
    handleClickHide = () =>
        this.updateSelectedRecords({hidden: true, status: 'finished'});
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
            onClickReviewed: this.handleClickReviewed,
            onClickNeedsReview: this.handleClickNeedsReview,

            onClickHide: this.handleClickHide,
            onClickUnhide: this.handleClickUnhide,
        };
    }

    renderContent() {
        const commonProps = this.getCommonProps();

        if (this.isDesktop()) {
            const results = this.getSortedResults();
            const count = results.length;

            return (
                <>
                    {this.renderTableHeader()}
                    <div
                        style={{
                            height: `calc(100vh - (142px + ${Sizes.HEADER_SIZE}))`,
                            background: 'white',
                        }}
                    >
                        <BaseTable
                            defaultSorted={this.props.defaultSorters}
                            defaultSortDesc={true}
                            pageSize={
                                count
                                    ? Math.min(count, this.pageSize)
                                    : this.pageSize
                            }
                            style={{
                                maxHeight: '100%',
                            }}
                            pages={
                                results.length >= this.pageSize
                                    ? this.state.page + 1
                                    : this.state.page
                            }
                            showPagination={true}
                            showPageSizeOptions={false}
                            manual={true}
                            loading={this.state.loading > 0}
                            data={results}
                            columns={this.props.tableColumns({
                                updateRecords: this.updateRecords,
                            })}
                            getTrProps={this.getTrProps}
                            onFetchData={(state) => {
                                this.handleCloseContextMenu();

                                this.sorters = state.sorted;
                                this.filters = state.filtered.filter(
                                    (filter) => filter.value !== undefined,
                                );

                                this.loadMore({
                                    page: state.page + 1,
                                });
                            }}
                        />
                    </div>
                    {this.renderTableFooter()}
                    <AnchoredContextMenu
                        display={this.state.contextMenuDisplay}
                        left={this.state.contextMenuLeft}
                        top={this.state.contextMenuTop}
                    >
                        <ContextMenuItems
                            desktop={true}
                            {...this.getContextMenuItemsProps()}
                        />
                    </AnchoredContextMenu>
                </>
            );
        }

        return objectEntriesOfSameType(this.getGroupedResults()).map(
            ([date, items]) => (
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
            ),
        );
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
                        objectValuesOfSameType(this.state.selectedIds).filter(
                            Boolean,
                        ).length
                    }
                />
                {this.selectedItems.length > 0 && (
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
                        backgroundColor: isDesktop ? undefined : 'white',
                    }}
                >
                    {this.renderContent()}
                    {isDesktop ? null : (
                        <LoadMore
                            loading={loading}
                            onClick={() => {
                                this.loadMore({page: this.state.page + 1});
                            }}
                        />
                    )}
                    {this.renderDialogs()}
                    <Fab
                        variant="extended"
                        color="primary"
                        onClick={this.handleToggleAddModal}
                        size={isDesktop ? undefined : 'small'}
                        style={{
                            position: isDesktop ? 'absolute' : 'fixed',
                            bottom: isDesktop ? '80px' : '70px',
                            right: isDesktop ? '30px' : '10px',
                            zIndex: 1,
                        }}
                    >
                        <AddIcon />
                    </Fab>
                </div>
            </div>
        );
    }
}

export default (ownProps) => {
    const stateProps = useSelector(
        ({
            preferences,
            screen,
            refreshWidgets,
            currencies,
            moneyLocations,
            user,
        }: TypeGlobalState) => ({
            preferences,
            screen,
            refreshWidgets,
            currencies,
            moneyLocations,
            user,
        }),
    );
    const dispatch = useDispatch();

    return <MainScreenList {...ownProps} {...stateProps} dispatch={dispatch} />;
};
