// @flow
import React, { PureComponent } from 'react';
import { Col } from 'react-grid-system';
import { stringify } from 'query-string';
import moment from 'moment';
import groupBy from 'lodash/groupBy';

import { BigLoader, ButtonProgress } from '../../components/loaders';

import { createXHR } from 'common/utils/fetch';

import { Button, FormControlLabel, Checkbox } from '@material-ui/core';
import { connect } from 'react-redux';
import { greyedOut } from 'common/defs/styles';
import BaseTable from 'common/components/BaseTable';
import cssTable from 'common/components/BaseTable/index.pcss';
import { getTrProps } from 'common/components/MainScreen/Table/helpers';
import MainScreenListGroup from 'mobile/ui/internal/common/MainScreenListGroup';
import MainScreenCreatorDialog from './MainScreenCreatorDialog';
import { convertCurrencyToDefault } from '../../../../common/helpers/currency';
import { numericValue } from '../../formatters';
import { Sizes } from 'common/defs';
import AnchoredContextMenu from 'common/components/MainScreen/ContextMenu/AnchoredContextMenu';
import MainScreenDeleteDialog from './MainScreenDeleteDialog';
import MainScreenEditDialog from './MainScreenEditDialog';
import AddIcon from '@material-ui/icons/Add';
import { refreshWidgets as onRefreshWidgets } from 'common/state/actions';
import { advanceRepeatDate } from 'shared/helpers/repeatedModels';
import { uniqueId } from 'lodash';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import IconSplit from '@material-ui/icons/CallSplitRounded';

type TypeProps = {
    api: {
        destroy: string,
        list: string,
        update: string,
        create: string,
    },
    preferences: TypePreferences,
    entityName: string,
    nameProperty: string,
    screen: TypeScreenQueries,
    crudProps: {
        // todo consider having stronger types here
        modelToForm: Function,
        formToModel: Function,
        formComponent: React$PureComponent<any>,
    },
    tableColumns: Array<{}>,
    contentComponent: React$PureComponent<any>,
    currencies: TypeCurrencies,
    newRecord: {
        id: number,
        repeat: string,
    },
    refreshWidgets: string,
    onRefreshWidgets: typeof onRefreshWidgets,
    features: TypeMainScreenFeatures,
    defaultSorters: Array<{ id: string, desc: boolean }>,
};

type TypeState = {
    firstLoad: boolean,
    page: number,
    results: Array<{
        id: number,
        created_at: string,
        sum: number,
    }>,
    loading: number,
    refreshing: boolean,
    selectedIds: {},

    addModalOpen: boolean,
    editDialogOpen: boolean,
    editDialogKey: string,
    deleteDialogOpen: boolean,
};

export const getDetachedItemUpdates = (item) => {
    const itemUpdates = { id: item.id, repeat: null };

    return itemUpdates;
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

        pendingTransactionsFirst: true,
        displayHidden: false,
        splitAmount: '',
    };
    sorters = [];
    filters = [];

    get pageSize() {
        return this.isDesktop() ? 200 : 50;
    }

    static defaultProps = {
        features: {
            duplicate: true,
            status: true,
            repeat: true,
        },
        defaultSorters: [{ id: 'created_at', desc: true }],
    };

    componentDidMount() {
        if (!this.isDesktop()) {
            this.loadMore();
        }
    }

    handleReceiveNewRecord(newRecord) {
        if (
            newRecord &&
            this.state.results.filter((each) => each.id == newRecord.id)
                .length === 0
        ) {
            this.setState({
                results: this.state.results.concat(newRecord),
            });

            this.props.onRefreshWidgets();
        }
    }

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps({ preferences, refreshWidgets }) {
        if (refreshWidgets !== this.props.refreshWidgets) {
            this.refresh();
        }

        const { endDate } = preferences;

        if (endDate !== this.props.preferences.endDate) {
            this.refresh({ endDate });
        }
    }

    handleToggleDeleteDialog = () =>
        this.setState((state) => ({ deleteDialogOpen: !state.deleteDialogOpen }));
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
            this.selectedItems.map((each) => ({ id: each.id })),
        );

        this.props.onRefreshWidgets();
    };

    handleUpdate = () => {
        this.handleToggleEditDialog();
        this.props.onRefreshWidgets();
    };

    loadMore = async ({
        page = this.state.page,
        results = this.state.results,
        endDate = this.props.preferences.endDate,
    } = {}) => {
        const infiniteScroll = !this.isDesktop();

        if (this.state.loading) {
            return;
        }

        this.setState((state) => ({ loading: state.loading + 1 }));

        const response = await createXHR({
            url: `${this.props.api.list}?${stringify({
                end_date: endDate,
                page,
                limit: this.pageSize,
                sorters: JSON.stringify(
                    [
                        this.state.pendingTransactionsFirst
                            ? { id: 'status', desc: true }
                            : null,
                        ...this.sorters,
                    ].filter(Boolean),
                ),
                filters: JSON.stringify([
                    this.state.displayHidden ? null : {
                        id: 'hidden',
                        value: false,
                    },
                    ...this.filters
                ].filter(Boolean)),
            })}`,
        });
        const json = response.data;

        this.setState((state) => ({
            page: infiniteScroll ? page + 1 : page,
            results: infiniteScroll ? results.concat(json) : json,
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

    refresh = async ({ endDate = this.props.preferences.endDate } = {}) => {
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

    handleReceivedSelectedIds = (selectedIds) => this.setState({ selectedIds });
    handleChangeContextMenu = ({
        display,
        top = 0,
        left = 0,
    }: {
        display: boolean,
        top?: number,
        left?: number,
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
        const mlIdToCurrencyId = this.props.moneyLocations
            .toJSON()
            .reduce((acc, each) => {
                acc[each.id] = each.currency_id;

                return acc;
            }, {});

        return items.reduce((acc, each) => {
            const sum = convertCurrencyToDefault(
                each.sum,
                mlIdToCurrencyId[each.money_location_id],
                this.props.currencies,
            );

            return acc + (each.type === 'deposit' ? sum : -sum);
        }, 0);
    }

    computeSelectedAmount() {
        return this.computeAmount(this.selectedItems);
    }

    computePageAmount() {
        return this.computeAmount(this.state.results);
    }

    handleSelectAll = (event) => {
        event.preventDefault();

        this.handleReceivedSelectedIds(
            this.state.results.reduce((acc, each) => {
                acc[each.id] = true;

                return acc;
            }, {}),
        );
    };

    renderTableHeader() {
        return (
            <div className={cssTable.header}>
                <div className="inlineBlock hPadded">
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.state.pendingTransactionsFirst}
                                onChange={
                                    this.handleTogglePendingTransactionsFirst
                                }
                                color="default"
                            />
                        }
                        label="Pending Transactions First"
                    />
                </div>
                <div className="inlineBlock hPadded">
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.state.displayHidden}
                                onChange={
                                    this.handleToggleDisplayHidden
                                }
                                color="default"
                            />
                        }
                        label="Display Hidden"
                    />
                </div>
                <div className="inlineBlock hPadded">
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={this.handleSelectAll}
                    >
                        Select All
                    </Button>
                </div>
                <div className="inlineBlock hPadded">
                    <TextField
                        error={isNaN(
                            this.parseSplitAmount(this.state.splitAmount),
                        )}
                        placeholder="Split"
                        value={this.state.splitAmount}
                        onChange={this.handleChangeSplitAmount}
                        margin="normal"
                        variant="outlined"
                        style={{
                            width: '150px',
                            height: '32px',
                            margin: '-7px 0 0',
                        }}
                        InputProps={{
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
                </div>
            </div>
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
        this.setState({ splitAmount: event.target.value });
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

        this.props.onRefreshWidgets();
    };

    handleTogglePendingTransactionsFirst = () =>
        this.setState(
            (state) => ({
                pendingTransactionsFirst: !state.pendingTransactionsFirst,
            }),
            this.refresh,
        );

    handleToggleDisplayHidden = () =>
        this.setState(
            (state) => ({
                displayHidden: !state.displayHidden,
            }),
            this.refresh,
        );

    renderTableFooter() {
        const divider = ' | ';

        return (
            <div className={cssTable.footer}>
                <strong>Loaded:</strong> {this.state.results.length}
                {divider}
                <strong>Selected:</strong>{' '}
                {Object.values(this.state.selectedIds).filter(Boolean).length}
                {divider}
                <strong>Current Page Balance:</strong>{' '}
                {numericValue(this.computePageAmount())}
                {divider}
                <strong>Selected Balance:</strong>{' '}
                {numericValue(this.computeSelectedAmount())}
            </div>
        );
    }

    handleCloseContextMenu = () =>
        this.handleChangeContextMenu({ display: false });

    updateSelectedRecords = async (data) => {
        const selectedItems = this.selectedItems;

        try {
            await this.handleRequestUpdate(
                selectedItems.map((each) => ({ id: each.id, ...data })),
            );

            this.props.onRefreshWidgets();
        } catch (e) {
            console.error(e);
            // todo
        }
    };

    withLoading = (fn) => async (...args: any[]) => {
        this.setState((state) => ({ loading: state.loading + 1 }));

        const res = await fn(...args);

        this.setState((state) => ({ loading: state.loading - 1 }));

        return res;
    };

    handleRequest = this.withLoading((data, api: string) =>
        createXHR({
            url: api,
            method: 'POST',
            data: { data },
        }),
    );
    handleRequestDelete = (data) =>
        this.handleRequest(data, this.props.api.destroy);
    handleRequestUpdate = (data) =>
        this.handleRequest(data, this.props.api.update);
    handleRequestCreate = (data) =>
        this.handleRequest(data, this.props.api.create);

    sanitizeItem = (item) =>
        this.props.crudProps.formToModel(
            this.props.crudProps.modelToForm(item),
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

                if (this.props.features.status) {
                    res.status = 'pending';
                }

                return res;
            }),
        );

        this.props.onRefreshWidgets();
    };

    handleClickReviewed = () =>
        this.updateSelectedRecords({ status: 'finished' });
    handleClickNeedsReview = () =>
        this.updateSelectedRecords({ status: 'pending' });
    handleClickAddFavorite = () =>
        this.updateSelectedRecords({ favorite: true });
    handleClickRemoveFavorite = () =>
        this.updateSelectedRecords({ favorite: false });
    handleClickHide = () => this.updateSelectedRecords({ hidden: true });
    handleClickUnhide = () => this.updateSelectedRecords({ hidden: false });
    handleClickDeposit = () => this.updateSelectedRecords({ type: 'deposit' });
    handleClickWithdrawal = () =>
        this.updateSelectedRecords({ type: 'withdrawal' });
    handleDetach = async () => {
        const added = [];
        const updated = [];
        const promises = [];

        this.selectedItems.forEach((item) => {
            if (item.repeat != null) {
                const extra = {};

                if (item.repeat_occurrences) {
                    extra.repeat_occurrences = item.repeat_occurrences - 1;

                    if (extra.repeat_occurrences === 0) {
                        extra.repeat_occurrences = null;
                    }
                }

                added.push(this.copyItem(advanceRepeatDate({ ...item, ...extra })));
                updated.push(getDetachedItemUpdates(item));
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

            this.props.onRefreshWidgets();
        }
    };

    getContextMenuItemsProps() {
        return {
            selectedIds: this.state.selectedIds,
            onClickEdit: this.handleToggleEditDialog,
            onClickDelete: this.handleToggleDeleteDialog,
            onClickDuplicate: this.handleDuplicate,
            onClickDetach: this.handleDetach,
            onCloseContextMenu: this.handleCloseContextMenu,
            onClickDeposit: this.handleClickDeposit,
            onClickWithdrawal: this.handleClickWithdrawal,
            onClickReviewed: this.handleClickReviewed,
            onClickNeedsReview: this.handleClickNeedsReview,

            onClickAddFavorite: this.handleClickAddFavorite,
            onClickRemoveFavorite: this.handleClickRemoveFavorite,

            onClickHide: this.handleClickHide,
            onClickUnhide: this.handleClickUnhide,

            features: this.props.features,
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
                            height: `calc(100vh - (150px + ${
                                Sizes.HEADER_SIZE
                            }))`,
                            background: 'white',
                        }}
                    >
                        <BaseTable
                            defaultSorted={this.props.defaultSorters}
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
                            columns={this.props.tableColumns}
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
                    {this.state.contextMenuDisplay && (
                        <AnchoredContextMenu
                            left={this.state.contextMenuLeft}
                            top={this.state.contextMenuTop}
                            itemsProps={this.getContextMenuItemsProps()}
                        />
                    )}
                </>
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
                {this.selectedItems.length > 0 && (
                    <MainScreenEditDialog
                        key={this.state.editDialogKey}
                        open={this.state.editDialogOpen}
                        items={selectedItems}
                        onCancel={this.handleToggleEditDialog}
                        onSave={this.handleUpdate}
                        entityName={this.props.entityName}
                        onRequestUpdate={this.handleRequestUpdate}
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

        const { loading } = this.state;
        const isDesktop = this.isDesktop();

        return (
            <div>
                <div
                    style={{
                        ...(this.state.refreshing ? greyedOut : {}),
                        backgroundColor: isDesktop ? undefined : 'white',
                    }}
                >
                    {this.renderContent()}
                    {isDesktop ? null : (
                        <Col>
                            <Button
                                variant="contained"
                                fullWidth={true}
                                onTouchTap={this.loadMore}
                                style={{ margin: '20px 0 60px' }}
                                disabled={loading}
                            >
                                {loading ? <ButtonProgress /> : 'Load More'}
                            </Button>
                        </Col>
                    )}
                    {this.renderDialogs()}
                    <Button
                        variant="fab"
                        color="primary"
                        onClick={this.handleToggleAddModal}
                        mini={!isDesktop}
                        style={{
                            position: isDesktop ? 'absolute' : 'fixed',
                            bottom: isDesktop ? '80px' : '70px',
                            right: isDesktop ? '30px' : '10px',
                            zIndex: 1,
                        }}
                    >
                        <AddIcon />
                    </Button>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = { onRefreshWidgets };

export default connect(
    ({
        preferences,
        screen,
        refreshWidgets,
        currencies,
        moneyLocations,
    }): {
        preferences: TypePreferences,
        screen: TypeScreenQueries,
        refreshWidgets: string,
        currencies: TypeCurrencies,
    } => ({
        preferences,
        screen,
        refreshWidgets,
        currencies,
        moneyLocations,
    }),
    mapDispatchToProps,
)(MainScreenList);
