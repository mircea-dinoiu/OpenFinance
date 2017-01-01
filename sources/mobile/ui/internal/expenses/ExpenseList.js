import React, {PureComponent} from 'react';
import {RaisedButton, Subheader, Divider, Avatar, Chip} from 'material-ui';
import {Row, Col} from 'react-grid-system';
import {BigLoader, ButtonProgress} from '../../components/loaders';
import routes from 'common/defs/routes';
import fetch from 'common/utils/fetch';
import {stringify} from 'query-string';
import moment from 'moment';
import {List, ListItem} from 'material-ui/List';
import {groupBy, sortBy} from 'lodash';
import {cyan50, grey500, grey700, yellowA700, cyan500} from 'material-ui/styles/colors';

import {CalendarWithoutTime} from 'common/defs/formats';
import RepeatOptions from 'common/defs/repeatOptions';

import Warning from 'material-ui/svg-icons/alert/warning';
import Cached from 'material-ui/svg-icons/action/cached';

class ExpenseItem extends PureComponent {
    state = {
        expanded: false
    };

    toggleDetails = () => {
        this.setState({
            expanded: !this.state.expanded
        });
    };

    render() {
        const item = this.props.item;
        const userList = this.props.data.user.get('list');
        const currenciesMap = this.props.data.currencies.get('map');
        const currencyISOCode = currenciesMap.getIn([String(item.currency_id), 'iso_code']);

        return (
            <ListItem key={item.id}
                      onTouchTap={this.toggleDetails}
                      style={{backgroundColor: this.state.expanded ? cyan50 : null}}
            >
                <Row>
                    <Col xs={6}>{item.item}</Col>
                    <Col xs={6} style={{textAlign: 'right'}}>
                        {userList.map(
                            each => item.users.includes(each.get('id')) ? (
                                <Avatar key={each.get('id')} src={each.get('avatar')} size={20} style={{marginLeft: 5}}/>
                            ) : null
                        )}
                    </Col>
                </Row>
                <Row>
                    <Col xs={6}>
                        <span style={{fontSize: 14, float: 'left', lineHeight: '20px'}}>
                            <span style={{color: grey700}}>{currencyISOCode}</span> {new Intl.NumberFormat().format(item.sum)}
                        </span>
                        &nbsp;
                        {item.status === 'pending' && <Warning style={{height: 20, width: 20}} color={yellowA700}/>}
                        {item.repeat != null && <Cached style={{height: 20, width: 20}} color={cyan500}/>}
                    </Col>
                    <Col xs={6} style={{textAlign: 'right'}}>
                        <span style={{fontSize: 14, color: grey700}}>{this.props.data.moneyLocations.find(each => each.get('id') === item.money_location_id).get('name')}</span>
                    </Col>
                </Row>
                {this.state.expanded && (
                    <div>
                        <Row style={{fontSize: 14, color: grey500}}>
                            <Col xs={6}>{moment(item.created_at).format('lll')}</Col>
                            <Col xs={6} style={{textAlign: 'right'}}>{item.repeat ? `Repeats ${RepeatOptions.filter(each => each[0] === item.repeat)[0][1]}` : 'Does not repeat'}</Col>
                        </Row>
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap'
                        }}>
                            {this.props.data.categories.map(each => item.categories.includes(each.get('id')) ? (
                                <Chip
                                    key={each.get('id')}
                                    style={{margin: '5px 5px 0 0'}}
                                >
                                    {each.get('name')}
                                </Chip>
                            ) : null)}
                        </div>
                    </div>
                )}
            </ListItem>
        );
    }
}

export default class ExpenseList extends PureComponent {
    state = {
        firstLoad: true,
        page: 1,
        results: [],
        loadingMore: false
    };

    componentDidMount() {
        this.loadMore();
    }

    componentWillReceiveProps({newExpense}) {
        if (newExpense && this.state.results.filter(each => each.id == newExpense.id).length === 0) {
            this.setState({
                results: this.state.results.concat(newExpense)
            });
        }
    }

    loadMore = async() => {
        this.setState({
            loadingMore: true
        });

        const response = await fetch(`${routes.expense.list}?${stringify({
            end_date: moment().format('YYYY-MM-DD'),
            page: this.state.page,
            per_page: 50
        })}`);

        const json = await response.json();

        this.setState({
            page: this.state.page + 1,
            results: this.state.results.concat(json),
            firstLoad: false,
            loadingMore: false
        });
    };

    getGroupedResults() {
        const results = sortBy(this.state.results, 'created_at').reverse();

        return groupBy(results, each => moment(each.created_at).format('YYYY-MM-DD'));
    }

    render() {
        return (
            <div>
                {this.state.firstLoad ? <BigLoader/> : (
                    <div>
                        {Object.entries(this.getGroupedResults()).map(([date, items]) => {
                            return (
                                <div key={date}>
                                    <List>
                                        <Subheader style={{textAlign: 'center'}}>{moment(date).calendar(null, CalendarWithoutTime)}</Subheader>
                                        {items.map(item => (
                                            <ExpenseItem key={item.id} item={item} data={this.props}/>
                                        ))}
                                    </List>
                                    <Divider/>
                                </div>
                            )
                        })}
                        <Col>
                            <RaisedButton
                                label={this.state.loadingMore ? <ButtonProgress/> : 'Load More'}
                                fullWidth={true}
                                onClick={this.loadMore}
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