// @flow
import React, {PureComponent} from 'react';
import {Col} from 'react-grid-system';
import {stringify} from 'query-string';
import moment from 'moment';
import Immutable from 'immutable';

import {BigLoader, ButtonProgress} from '../../components/loaders';

import fetch, {fetchJSON} from 'common/utils/fetch';
import {CalendarWithoutTime} from 'common/defs/formats';

import {List} from 'material-ui/List';
import {
    RaisedButton,
    Subheader,
    Divider,
    Table,
    TableBody,
    TableHeader
} from 'material-ui';
import {connect} from 'react-redux';
import {greyedOut} from 'common/defs/styles';
import {scrollIsAt} from 'common/utils/scroll';
import FinancialTable from 'common/components/FinancialTable';
import {formatYMD} from 'common/utils/dates';

const PAGE_SIZE = 50;

class MainScreenList extends PureComponent {
    props: {
        api: {
            destroy: string,
            list: string
        },
        listItemComponent: any
    };

    state = {
        firstLoad: true,
        page: 1,
        results: Immutable.List(),
        loadingMore: false,
        refreshing: false
    };

    componentDidMount() {
        this.loadMore();
    }

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps({newRecord, preferences, refreshWidgets}) {
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
                        Immutable.fromJS([newRecord])
                    )
                });
            }
        }

        if (refreshWidgets !== this.props.refreshWidgets) {
            this.refresh();
        }

        const {endDate} = preferences;

        if (endDate !== this.props.preferences.endDate) {
            this.refresh({endDate});
        }
    }

    loadMore = async ({
        page = this.state.page,
        results = this.state.results,
        endDate = this.props.preferences.endDate
    } = {}) => {
        if (this.state.loadingMore === true) {
            return;
        }

        this.setState({
            loadingMore: true
        });

        const response = await fetch(
            `${this.props.api.list}?${stringify({
                end_date: endDate,
                page,
                limit: PAGE_SIZE
            })}`
        );
        const json = await response.json();

        this.setState({
            page: page + 1,
            results: results.concat(Immutable.fromJS(json)),
            firstLoad: false,
            loadingMore: false
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
                moment(each.get('created_at')).format('YYYY-MM-DD')
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
                data: [{id}]
            }
        });

        // Keep the nice deleted message a bit more
        setTimeout(() => {
            this.refresh();
        }, 500);
    };

    refresh = async ({endDate = this.props.preferences.endDate} = {}) => {
        this.setState({
            refreshing: true
        });

        await this.loadMore({
            page: 1,
            results: Immutable.List(),
            endDate
        });

        this.setState({
            refreshing: false
        });
    };

    renderItem(item) {
        const ListItem = this.props.listItemComponent;

        return (
            <ListItem
                key={item.get('id')}
                item={item.toJS()}
                onDelete={this.handleDelete}
                onUpdate={this.handleUpdate}
                api={this.props.api}
            />
        );
    }

    onTableScroll = (event) => {
        const element = event.target;

        if (scrollIsAt(element, 80)) {
            this.loadMore();
        }
    };

    getTrClassName(item): string {
        const classes = [];
        const day = formatYMD;

        if (moment(item.created_at).date() % 2 === 0) {
            classes.push('msl__even-row');
        } else {
            classes.push('msl__odd-row');
        }

        if (day(item.created_at) === day(new Date())) {
            classes.push('msl__today-row');
        } else if (day(item.created_at) > day(new Date())) {
            classes.push('msl__future-row');
        }

        return classes.join(' ');
    }

    getTrProps = (state, item) => {
        return {
            className: this.getTrClassName(item.original),
        };
    };

    renderResults() {
        if (this.props.screen.isLarge) {
            const results = this.getSortedResults().toJS();

            return (
                <div onScroll={this.onTableScroll}>
                    <FinancialTable
                        style={{
                            height: 'calc(100vh - 120px)'
                        }}
                        loading={this.state.loadingMore}
                        data={results}
                        columns={this.props.tableColumns}
                        getTrProps={this.getTrProps}
                    />
                </div>
            );
        }

        return this.getGroupedResults().map(([date, items]) => (
            <div key={date}>
                <List>
                    <Subheader style={{textAlign: 'center'}}>
                        {moment(date).calendar(null, CalendarWithoutTime)}
                    </Subheader>
                    {items.map((item) => this.renderItem(item)).toArray()}
                </List>
                <Divider />
            </div>
        ));
    }

    render() {
        if (this.state.firstLoad) {
            return <BigLoader />;
        }

        return (
            <div>
                <div style={this.state.refreshing ? greyedOut : {}}>
                    {this.renderResults()}
                    {this.props.screen.isLarge ? null : (
                        <Col>
                            <RaisedButton
                                label={
                                    this.state.loadingMore ? (
                                        <ButtonProgress />
                                    ) : (
                                        'Load More'
                                    )
                                }
                                fullWidth={true}
                                onTouchTap={this.loadMore}
                                style={{margin: '20px 0 60px'}}
                                disabled={this.state.loadingMore}
                            />
                        </Col>
                    )}
                </div>
            </div>
        );
    }
}

export default connect(({preferences, screen, refreshWidgets}) => ({
    preferences,
    screen,
    refreshWidgets
}))(MainScreenList);
