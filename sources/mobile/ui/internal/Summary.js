import React from 'react';
import {BigLoader} from '../components/loaders';
import {Subheader, List, ListItem, RefreshIndicator, Card, CardHeader, CardText} from 'material-ui';
import * as colors from 'material-ui/styles/colors';
import ReactPullToRefresh from 'react-pull-to-refresh';
import routes from '../../../common/defs/routes';
import {stringify} from 'query-string';
import {fetch} from '../../../common/utils/fetch';
import {numericValue} from '../formatters';
import {groupBy} from 'lodash';
import {connect} from 'react-redux';

class Summary extends React.PureComponent {
    state = {
        firstLoad: true,
        results: null,
        refreshing: false
    };

    handleRefresh = async() => {
        this.setState({
            refreshing: true
        });

        await this.load();

        this.setState({
            refreshing: false
        });
    };

    componentDidMount() {
        this.load();
    }

    load = async () => {
        const response = await fetch(`${routes.report.summary}?${stringify({
            end_date: this.props.endDate,
            html: false
        })}`);
        const json = await response.json();

        this.setState({
            results: json,
            firstLoad: false,
        });
    };

    numericValue(value) {
        const currencyISOCode = this.props.currencies.getIn(['map', String(this.props.currencies.get('default')), 'iso_code']);

        return numericValue(value, currencyISOCode);
    }
    renderResults() {
        const {remainingData} = this.state.results;
        const headerColor = 'rgba(255, 255, 255, 0.9)';
        const balanceBg = '#6AA84F';

        return (
            <div style={{margin: '0 10px 20px'}}>
                <Card style={{backgroundColor: balanceBg}}>
                    <CardHeader style={{paddingBottom: 0}} title={<span style={{color: headerColor}}>BALANCE BY LOCATION</span>}/>
                    <CardText>
                        {Object.entries(groupBy(remainingData.byML, 'group')).map(([id, items]) => (
                            <Card style={{backgroundColor: id == 0 ? colors.grey200 : colors.white, marginBottom: 5}}>
                                {id != 0 && <CardHeader style={{paddingBottom: 0}} title={this.props.moneyLocationTypes.find(mlType => mlType.get('id') == id).get('name').toUpperCase()}/>}
                                <List>
                                    {items.map(each => (
                                        <ListItem
                                            primaryText={each.description}
                                            secondaryText={this.numericValue(each.sum)}
                                        />
                                    ))}
                                </List>
                            </Card>
                        ))}
                    </CardText>
                </Card>
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.state.firstLoad ? <BigLoader/> : (
                    <div>
                        <ReactPullToRefresh
                            onRefresh={this.handleRefresh}
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
                    </div>
                )}
                {this.state.results && this.renderResults()}
            </div>
        );
    }
}

export default connect(state => state)(Summary);