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
import {RaisedButton, Subheader, Divider, Table, TableBody, TableHeader} from 'material-ui';
import {connect} from 'react-redux';
import {greyedOut} from 'common/defs/styles';

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

    getLimit() {
        if (this.props.screen.isLarge) {
            return 250;
        }

        return 50;
    }

    componentWillReceiveProps({newRecord, endDate, refreshWidgets}) {
        if (newRecord && this.state.results.filter(each => each.get('id') == newRecord.id).size === 0) {
            if (newRecord.repeat) {
                this.refresh();
            } else {
                this.setState({
                    results: this.state.results.concat(Immutable.fromJS([newRecord]))
                });
            }
        }
        
        if (refreshWidgets !== this.props.refreshWidgets) {
            this.refresh();
        }

        if (endDate !== this.props.endDate) {
            this.refresh({endDate});
        }
    }

    loadMore = async ({
                          page = this.state.page,
                          results = this.state.results,
                          endDate = this.props.endDate,
                      } = {}) => {
        if (this.state.loadingMore === true) {
            return;
        }

        this.setState({
            loadingMore: true
        });

        const response = await fetch(`${this.props.api.list}?${stringify({
            end_date: endDate,
            page,
            limit: this.getLimit(),
        })}`);

        const json = await response.json();

        this.setState({
            page: page + 1,
            results: results.concat(Immutable.fromJS(json)),
            firstLoad: false,
            loadingMore: false
        });
    };

    getSortedResults() {
        return this.state.results.sortBy(each => each.get('created_at')).reverse();
    }

    getGroupedResults() {
        const results = this.getSortedResults();

        return results.groupBy(each => moment(each.get('created_at')).format('YYYY-MM-DD')).entrySeq();
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

    refresh = async ({endDate = this.props.endDate} = {}) => {
        this.setState({
            refreshing: true
        });

        await this.loadMore({
            page: 1,
            results: Immutable.List(),
            endDate,
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

    renderResults() {
        if (this.props.screen.isLarge) {
            const Header = this.props.headerComponent;

            return (
                <Table
                    height="calc(100vh - 180px)"
                >
                    <TableHeader>
                        <Header/>
                    </TableHeader>
                    <TableBody>
                        {this.getSortedResults().map((item) => (
                            this.renderItem(item)
                        ))}
                    </TableBody>
                </Table>
            );
        }

        return this.getGroupedResults().map(([date, items]) => {
            return (
                <div key={date}>
                    <List>
                        <Subheader
                            style={{textAlign: 'center'}}>{moment(date).calendar(null, CalendarWithoutTime)}</Subheader>
                        {items.map(item => (
                            this.renderItem(item)
                        )).toArray()}
                    </List>
                    <Divider/>
                </div>
            );
        });
    }

    render() {
        if (this.state.firstLoad) {
            return <BigLoader/>;
        }

        return (
            <div>
                <div style={this.state.refreshing ? greyedOut : {}}>
                    {this.renderResults()}
                    {this.props.screen.isLarge ? null : (
                        <Col>
                            <RaisedButton
                                label={this.state.loadingMore ? <ButtonProgress/> : 'Load More'}
                                fullWidth={true}
                                onTouchTap={this.loadMore}
                                style={{margin: '20px 0 40px'}}
                                disabled={this.state.loadingMore}
                            />
                        </Col>
                    )}
                </div>
            </div>
        );
    }
}

export default connect(({
                            endDate,
                            screen,
                            refreshWidgets,
                        }) => ({
    endDate,
    screen,
    refreshWidgets,
}))(MainScreenList);