// @flow
import React, { PureComponent } from 'react';
import { Col } from 'react-grid-system';
import { stringify } from 'query-string';
import moment from 'moment';
import Immutable from 'immutable';

import { BigLoader, ButtonProgress } from '../../components/loaders';

import fetch, { fetchJSON } from 'common/utils/fetch';

import { RaisedButton } from 'material-ui';
import { connect } from 'react-redux';
import { greyedOut } from 'common/defs/styles';
import { scrollIsAt } from 'common/utils/scroll';
import BaseTable from 'common/components/BaseTable';
import cssTable from 'common/components/BaseTable/index.pcss';
import { getTrProps } from 'common/components/MainScreen/Table/helpers';
import MainScreenListGroup from 'mobile/ui/internal/common/MainScreenListGroup';
import { convertCurrencyToDefault } from '../../../../common/helpers/currency';
import { numericValue } from '../../formatters';
import { Sizes } from 'common/defs';

const PAGE_SIZE = 50;

type TypeProps = {
    api: {
        destroy: string,
        list: string,
    },
    preferences: TypePreferences,
    entityName: string,
    nameProperty: string,
    screen: TypeScreenQueries,
    editDialogProps: {
        // todo consider having stronger types here
        modelToForm: Function,
        formToModel: Function,
        formComponent: React$PureComponent<any>,
    },
    tableColumns: Array<{}>,
    contentComponent: React$PureComponent<any>,
    currencies: TypeCurrencies,
};

type TypeState = {
    firstLoad: boolean,
    page: number,
    results: Immutable.List,
    loadingMore: boolean,
    refreshing: boolean,
    selectedIds: number[],
};

class MainScreenList extends PureComponent<TypeProps, TypeState> {
    state = {
        firstLoad: true,
        page: 1,
        results: Immutable.List(),
        loadingMore: false,
        refreshing: false,
        selectedIds: [],
    };

    componentDidMount() {
        this.loadMore();
    }

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps({
        newRecord,
        preferences,
        refreshWidgets,
    }) {
        if (
            newRecord &&
            this.state.results.filter((each) => each.get('id') == newRecord.id)
                .size === 0
        ) {
            if (newRecord.repeat) {
                this.refresh();
            } else {
                this.setState({
                    results: this.state.results.concat(
                        Immutable.fromJS([newRecord]),
                    ),
                });
            }
        }

        if (refreshWidgets !== this.props.refreshWidgets) {
            this.refresh();
        }

        const { endDate } = preferences;

        if (endDate !== this.props.preferences.endDate) {
            this.refresh({ endDate });
        }
    }

    loadMore = async ({
        page = this.state.page,
        results = this.state.results,
        endDate = this.props.preferences.endDate,
    } = {}) => {
        if (this.state.loadingMore === true) {
            return;
        }

        this.setState({
            loadingMore: true,
        });

        const response = await fetch(
            `${this.props.api.list}?${stringify({
                end_date: endDate,
                page,
                limit: PAGE_SIZE,
            })}`,
        );
        const json = await response.json();

        this.setState({
            page: page + 1,
            results: results.concat(Immutable.fromJS(json)),
            firstLoad: false,
            loadingMore: false,
        });
    };

    getSortedResults() {
        return this.state.results
            .sortBy((each) => each.get('created_at'))
            .reverse();
    }

    getGroupedResults() {
        const results = this.getSortedResults();

        return results
            .groupBy((each) =>
                moment(each.get('created_at')).format('YYYY-MM-DD'),
            )
            .entrySeq();
    }

    handleUpdate = () => {
        this.refresh();
    };

    handleDelete = async (id) => {
        await fetchJSON(this.props.api.destroy, {
            method: 'POST',
            body: {
                data: [{ id }],
            },
        });

        // Keep the nice deleted message a bit more
        setTimeout(() => {
            this.refresh();
        }, 500);
    };

    refresh = async ({ endDate = this.props.preferences.endDate } = {}) => {
        this.setState({
            refreshing: true,
        });

        await this.loadMore({
            page: 1,
            results: Immutable.List(),
            endDate,
        });

        this.setState({
            refreshing: false,
        });
    };

    onTableScroll = (event) => {
        const element = event.target;

        if (scrollIsAt(element, 90)) {
            this.loadMore();
        }
    };

    getCommonProps() {
        return {
            onDelete: this.handleDelete,
            onUpdate: this.handleUpdate,
            api: this.props.api,
            entityName: this.props.entityName,
            nameProperty: this.props.nameProperty,
            editDialogProps: this.props.editDialogProps,
        };
    }

    getTrProps = (state, item) =>
        getTrProps({
            selectedIds: this.state.selectedIds,
            onDoubleClick: () => {},
            onReceiveSelectedIds: (selectedIds) => this.setState({ selectedIds }),
            item: item.original,
        });

    computeSelectedAmount() {
        return this.state.results.reduce((acc, each) => {
            if (this.state.selectedIds.includes(each.get('id'))) {
                const sum = convertCurrencyToDefault(
                    each.get('sum'),
                    each.get('currency_id'),
                    this.props.currencies,
                );

                return acc + sum;
            }

            return acc;
        }, 0);
    }

    renderTableFooter() {
        const divider = ', ';

        return (
            <div className={cssTable.footer}>
                <strong>Loaded:</strong> {this.state.results.size}
                {divider}
                <strong>Selected:</strong> {this.state.selectedIds.length}
                {divider}
                <strong>Selected amount:</strong>{' '}
                {numericValue(this.computeSelectedAmount())}
            </div>
        );
    }

    renderContent() {
        const commonProps = this.getCommonProps();

        if (this.props.screen.isLarge) {
            const results = this.getSortedResults().toJS();

            return (
                <div onScroll={this.onTableScroll}>
                    <BaseTable
                        style={{
                            height: `calc(100vh - (75px + ${
                                Sizes.HEADER_SIZE
                            }))`,
                        }}
                        loading={this.state.loadingMore}
                        data={results}
                        columns={this.props.tableColumns}
                        getTrProps={this.getTrProps}
                    />
                    {this.renderTableFooter()}
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
                }}
            />
        ));
    }

    render() {
        if (this.state.firstLoad) {
            return <BigLoader />;
        }

        const { screen } = this.props;
        const { loadingMore } = this.state;

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
                                    loadingMore ? (
                                        <ButtonProgress />
                                    ) : (
                                        'Load More'
                                    )
                                }
                                fullWidth={true}
                                onTouchTap={this.loadMore}
                                style={{ margin: '20px 0 60px' }}
                                disabled={loadingMore}
                            />
                        </Col>
                    )}
                </div>
            </div>
        );
    }
}

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
)(MainScreenList);
