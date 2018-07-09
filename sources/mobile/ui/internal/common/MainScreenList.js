// @flow
import React, { PureComponent } from 'react';
import { Col } from 'react-grid-system';
import { stringify } from 'query-string';
import moment from 'moment';
import sortBy from 'lodash/sortBy';
import groupBy from 'lodash/groupBy';
import throttle from 'lodash/throttle';

import { BigLoader, ButtonProgress } from '../../components/loaders';

import fetch, { fetchJSON } from 'common/utils/fetch';

import { RaisedButton, FloatingActionButton } from 'material-ui';
import { connect } from 'react-redux';
import { greyedOut } from 'common/defs/styles';
import { scrollIsAt } from 'common/utils/scroll';
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
import AddIcon from 'material-ui-icons/Add';
import { refreshWidgets as onRefreshWidgets } from 'common/state/actions';
import { advanceRepeatDate } from 'shared/helpers/repeatedModels';

const PAGE_SIZE = 50;

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
};

type TypeState = {
    firstLoad: boolean,
    page: number,
    results: Array<{
        id: number,
        created_at: string,
        sum: number,
        currency_id: number,
    }>,
    loading: number,
    refreshing: boolean,
    selectedIds: number[],

    addModalOpen: boolean,
    editDialogOpen: boolean,
    deleteDialogOpen: boolean,
};

class MainScreenList extends PureComponent<TypeProps, TypeState> {
    state = {
        firstLoad: true,
        page: 1,
        results: [],
        loading: 0,
        refreshing: false,
        selectedIds: [],
        contextMenuDisplay: false,
        contextMenuTop: 0,
        contextMenuLeft: 0,

        addModalOpen: false,
        editDialogOpen: false,
        deleteDialogOpen: false,
    };

    static defaultProps = {
        features: {
            duplicate: true,
            status: true,
            repeat: true,
        },
    };

    componentDidMount() {
        this.loadMore();
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
        this.setState((state) => ({ editDialogOpen: !state.editDialogOpen }));
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
        if (this.state.loading) {
            return;
        }

        this.setState((state) => ({ loading: state.loading + 1 }));

        const response = await fetch(
            `${this.props.api.list}?${stringify({
                end_date: endDate,
                page,
                limit: PAGE_SIZE,
            })}`,
        );
        const json = await response.json();

        this.setState((state) => ({
            page: page + 1,
            results: results.concat(json),
            firstLoad: false,
            loading: state.loading - 1,
        }));
    };

    getSortedResults() {
        return sortBy(this.state.results, 'created_at').reverse();
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
            page: 1,
            results: [],
            endDate,
        });

        this.setState({
            refreshing: false,
        });
    };

    handleTableScroll = (event) => {
        this.handleTableScrollThrottled(event.target);
    };

    handleTableScrollThrottled = throttle((element) => {
        this.handleCloseContextMenu();

        if (scrollIsAt(element, 90)) {
            this.loadMore();
        }
    });

    getCommonProps() {
        return {
            api: this.props.api,
            entityName: this.props.entityName,
            nameProperty: this.props.nameProperty,
            crudProps: this.props.crudProps,
        };
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
            this.state.selectedIds.includes(each.id),
        );
    }

    computeSelectedAmount() {
        return this.selectedItems.reduce((acc, each) => {
            const sum = convertCurrencyToDefault(
                each.sum,
                each.currency_id,
                this.props.currencies,
            );

            return acc + sum;
        }, 0);
    }

    renderTableFooter() {
        const divider = ', ';

        return (
            <div className={cssTable.footer}>
                <strong>Loaded:</strong> {this.state.results.length}
                {divider}
                <strong>Selected:</strong> {this.state.selectedIds.length}
                {divider}
                <strong>Selected amount:</strong>{' '}
                {numericValue(this.computeSelectedAmount())}
            </div>
        );
    }

    handleCloseContextMenu = () =>
        this.handleChangeContextMenu({ display: false });

    setStatusToSelectedRecords = async (status) => {
        const selectedItems = this.selectedItems;
        const response = await this.handleRequestUpdate(
            selectedItems.map((each) => ({ id: each.id, status })),
        );

        if (response.ok) {
            this.updateResultsFromUpdateResponse(await response.json());
        }
    };

    updateResultsFromUpdateResponse = (json) => {
        const results = Array.from(this.state.results);

        json.forEach((entry) => {
            const index = results.findIndex((each) => each.id === entry.id);

            results.splice(index, 1, entry);
        });

        this.setState({ results });
    };

    withLoading = (fn) => async (...args: any[]) => {
        this.setState((state) => ({ loading: state.loading + 1 }));

        const res = await fn(...args);

        this.setState((state) => ({ loading: state.loading - 1 }));

        return res;
    };

    handleRequest = this.withLoading((data, api: string) =>
        fetchJSON(api, {
            method: 'POST',
            body: { data },
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

        delete item.id;

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

    handleClickReviewed = () => this.setStatusToSelectedRecords('finished');
    handleClickNeedsReview = () => this.setStatusToSelectedRecords('pending');
    handleDetach = async () => {
        const added = [];
        const updated = [];
        const promises = [];

        this.selectedItems.forEach((item) => {
            if (item.repeat != null) {
                added.push(this.copyItem(advanceRepeatDate({ ...item })));
                updated.push({ id: item.id, repeat: null });
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
            onClickReviewed: this.handleClickReviewed,
            onClickNeedsReview: this.handleClickNeedsReview,
            features: this.props.features,
        };
    }

    renderContent() {
        const commonProps = this.getCommonProps();

        if (this.props.screen.isLarge) {
            const results = this.getSortedResults();

            return (
                <div onScroll={this.handleTableScroll}>
                    <BaseTable
                        style={{
                            height: `calc(100vh - (75px + ${
                                Sizes.HEADER_SIZE
                            }))`,
                        }}
                        loading={this.state.loading > 0}
                        data={results}
                        columns={this.props.tableColumns}
                        getTrProps={this.getTrProps}
                    />
                    {this.renderTableFooter()}
                    {this.state.contextMenuDisplay && (
                        <AnchoredContextMenu
                            left={this.state.contextMenuLeft}
                            top={this.state.contextMenuTop}
                            itemsProps={this.getContextMenuItemsProps()}
                        />
                    )}
                </div>
            );
        }

        return this.getGroupedResults().map(([date, items]) => (
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
            <React.Fragment>
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
                    count={this.state.selectedIds.length}
                />
                {this.selectedItems.length > 0 && (
                    <MainScreenEditDialog
                        key={selectedItems[0].id}
                        open={this.state.editDialogOpen}
                        item={selectedItems[0]}
                        onCancel={this.handleToggleEditDialog}
                        onSave={this.handleUpdate}
                        entityName={this.props.entityName}
                        onRequestUpdate={this.handleRequestUpdate}
                        {...this.props.crudProps}
                    />
                )}
            </React.Fragment>
        );
    }

    render() {
        if (this.state.firstLoad) {
            return <BigLoader />;
        }

        const { screen } = this.props;
        const { loading } = this.state;

        return (
            <div>
                <div
                    style={{
                        ...(this.state.refreshing ? greyedOut : {}),
                        backgroundColor: screen.isLarge ? undefined : 'white',
                    }}
                >
                    {this.renderContent()}
                    {screen.isLarge ? null : (
                        <Col>
                            <RaisedButton
                                label={
                                    loading ? <ButtonProgress /> : 'Load More'
                                }
                                fullWidth={true}
                                onTouchTap={this.loadMore}
                                style={{ margin: '20px 0 60px' }}
                                disabled={loading}
                            />
                        </Col>
                    )}
                    {this.renderDialogs()}
                    <FloatingActionButton
                        onClick={this.handleToggleAddModal}
                        mini={!this.props.screen.isLarge}
                        style={{
                            position: this.props.screen.isLarge
                                ? 'absolute'
                                : 'fixed',
                            bottom: this.props.screen.isLarge ? '20px' : '70px',
                            right: this.props.screen.isLarge ? '30px' : '10px',
                            zIndex: 1,
                        }}
                    >
                        <AddIcon />
                    </FloatingActionButton>
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
    }),
    mapDispatchToProps,
)(MainScreenList);
