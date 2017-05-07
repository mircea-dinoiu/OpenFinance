// @flow
import React, {PureComponent} from 'react';
import {Col} from 'react-grid-system';
import {stringify} from 'query-string';
import moment from 'moment';
import Immutable from 'immutable';
import ReactPullToRefresh from 'react-pull-to-refresh';

import {BigLoader, ButtonProgress} from '../../components/loaders';

import fetch, {fetchJSON} from 'common/utils/fetch';
import {CalendarWithoutTime} from 'common/defs/formats';

import {List} from 'material-ui/List';
import {RaisedButton, Subheader, Divider, RefreshIndicator} from 'material-ui';

export default class MainScreenList extends PureComponent {
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

    componentWillReceiveProps({newRecord}) {
        if (newRecord && this.state.results.filter(each => each.get('id') == newRecord.id).size === 0) {
            if (newRecord.repeat) {
                this.refresh();
            } else {
                this.setState({
                    results: this.state.results.concat(Immutable.fromJS([newRecord]))
                });
            }
        }
    }

    loadMore = async({
        page = this.state.page,
        results = this.state.results
    } = {}) => {
        if (this.state.loadingMore === true) {
            return;
        }

        this.setState({
            loadingMore: true
        });

        const response = await fetch(`${this.props.api.list}?${stringify({
            end_date: this.props.endDate,
            page: page,
            limit: 50
        })}`);

        const json = await response.json();

        this.setState({
            page: page + 1,
            results: results.concat(Immutable.fromJS(json)),
            firstLoad: false,
            loadingMore: false
        });
    };

    getGroupedResults() {
        const results = this.state.results.sortBy(each => each.get('created_at')).reverse();

        return results.groupBy(each => moment(each.get('created_at')).format('YYYY-MM-DD')).entrySeq();
    }

    handleUpdate = (data) => {
        this.refresh();
    };

    handleDelete = async(id) => {
        await fetchJSON(this.props.api.destroy, {
            method: 'POST',
            body: {
                data: [{id: id}]
            }
        });

        // Keep the nice deleted message a bit more
        setTimeout(() => {
            this.refresh();
        }, 500);
    };

    refresh = async() => {
        this.setState({
            refreshing: true
        });

        await this.loadMore({
            page: 1,
            results: Immutable.List()
        });

        this.setState({
            refreshing: false
        });
    };

    render() {
        const ListItem = this.props.listItemComponent;

        return (
            <div>
                {this.state.firstLoad ? <BigLoader/> : (
                        <div>
                            <ReactPullToRefresh
                                onRefresh={this.refresh}
                            >
                                {this.state.refreshing && (
                                    <RefreshIndicator
                                        size={40}
                                        left={10}
                                        top={0}
                                        status="loading"
                                        style={{display: 'block', position: 'relative', margin: '10px auto'}}
                                    />
                                )}
                                <Subheader style={{textAlign: 'center'}}>Pull down to refresh</Subheader>
                            </ReactPullToRefresh>
                            {this.getGroupedResults().map(([date, items]) => {
                                return (
                                    <div key={date}>
                                        <List>
                                            <Subheader style={{textAlign: 'center'}}>{moment(date).calendar(null, CalendarWithoutTime)}</Subheader>
                                            {items.map(item => (
                                                <ListItem
                                                    key={item.get('id')}
                                                    item={item.toJS()}
                                                    data={this.props}
                                                    onDelete={this.handleDelete}
                                                    onUpdate={this.handleUpdate}
                                                    api={this.props.api}
                                                />
                                            )).toArray()}
                                        </List>
                                        <Divider/>
                                    </div>
                                )
                            })}
                            <Col>
                                <RaisedButton
                                    label={this.state.loadingMore ? <ButtonProgress/> : 'Load More'}
                                    fullWidth={true}
                                    onTouchTap={this.loadMore}
                                    style={{margin: '20px 0 40px'}}
                                    disabled={this.state.loadingMore}
                                />
                            </Col>
                        </div>
                    )}
            </div>
        );
    }
}
