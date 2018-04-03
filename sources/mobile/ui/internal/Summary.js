import React from 'react';
import {BigLoader} from '../components/loaders';
import {
    List, Card, CardHeader, CardText, Paper, Table, TableBody, TableRow, TableRowColumn,
    TableHeaderColumn, TableHeader
} from 'material-ui';
import * as colors from 'material-ui/styles/colors';
import routes from '../../../common/defs/routes';
import {stringify} from 'query-string';
import {fetch} from '../../../common/utils/fetch';
import {numericValue} from '../formatters';
import {groupBy, pickBy, identity} from 'lodash';
import {connect} from 'react-redux';
import IncludeDropdown from 'common/components/IncludeDropdown';
import {getStartDate, formatYMD} from 'common/utils/dates';
import RefreshTrigger from 'common/components/RefreshTrigger';
import {greyedOut} from 'common/defs/styles';
import {Col, Row} from 'react-grid-system';

type TypeProps = {
    screen: TypeScreenQueries,
};

class Summary extends React.PureComponent<TypeProps> {
    state = {
        firstLoad: true,
        results: null,
        refreshing: false,
        include: 'ut'
    };

    componentDidMount() {
        this.load();
    }

    componentWillReceiveProps({endDate, refreshWidgets}) {
        if (endDate !== this.props.endDate) {
            this.load({endDate});
        }

        if (refreshWidgets !== this.props.refreshWidgets) {
            this.load();
        }
    }

    load = async ({endDate = this.props.endDate} = {}) => {
        this.setState({
            refreshing: true,
        });

        const response = await fetch(`${routes.report.summary}?${stringify({
            ...pickBy({
                end_date: this.state.include === 'ut' ? formatYMD() : endDate,
                start_date: getStartDate({
                    include: this.state.include,
                    endDate,
                }),
            }, identity),
            html: false
        })}`);
        const json = await response.json();

        this.setState({
            results: json,
            firstLoad: false,
            refreshing: false,
        });
    };

    numericValue(value, opts = {}) {
        const currency = this.props.currencies.getIn(['map', String(this.props.currencies.get('default')), 'iso_code']);

        return numericValue(value, {...opts, currency});
    }

    renderCategory({
                   backgroundColor,
                   title,
                   summaryObject,
                   entities,
                   entityIdField = 'id',
                   entityNameField = 'name'
               }) {
        const headerColor = 'rgba(255, 255, 255, 0.9)';
        const shouldGroup = summaryObject.every(each => each.hasOwnProperty('group'));

        return (
            <Card style={{marginBottom: 10}}>
                <CardHeader style={{backgroundColor, paddingTop: 0}}>
                    <div style={{color: headerColor}}>
                        {title} ({this.numericValue(
                            summaryObject.reduce((acc, each) => acc + each.sum, 0),
                            {currencyStyle: {color: headerColor}}
                        )})
                    </div>
                </CardHeader>

                <CardText style={{padding: '0 5px'}}>
                    {Object.entries(groupBy(summaryObject, 'group')).map(([id, items]) => (
                        <React.Fragment key={id}>
                            {shouldGroup && id != 0 && (
                                <CardHeader
                                    style={{paddingTop: 0, paddingBottom: 0}}
                                >
                                    <div>
                                        {entities.find(each => each.get(entityIdField) == id).get(entityNameField).toUpperCase()} ({this.numericValue(
                                            items.reduce((acc, each) => acc + each.sum, 0)
                                        )})
                                    </div>
                                </CardHeader>
                            )}
                            <Table>
                                <TableBody displayRowCheckbox={false}>
                                    {items.map((each, index) => (
                                        <TableRow selectable={false} key={index} style={{backgroundColor: id == 0 ? colors.grey200 : colors.white, marginBottom: 5}}>
                                            <TableRowColumn>{each.description}</TableRowColumn>
                                            <TableRowColumn style={{textAlign: 'right'}}>{this.numericValue(each.sum)}</TableRowColumn>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </React.Fragment>
                    ))}
                </CardText>
            </Card>
        );
    }

    renderResults() {
        const {remainingData} = this.state.results;
        const balanceBg = '#6AA84F';

        return (
            <div style={{margin: '0 0 20px'}}>
                {this.renderCategory({
                    backgroundColor: balanceBg,
                    title: 'Balance by location',
                    summaryObject: remainingData.byML,
                    entities: this.props.moneyLocationTypes
                })}

                {this.renderCategory({
                    backgroundColor: balanceBg,
                    title: 'Balance by user',
                    summaryObject: remainingData.byUser,
                    entities: this.props.user.get('list'),
                    entityNameField: 'full_name'
                })}
            </div>
        );
    }

    onIncludeChange = (include) => {
        this.setState({include}, this.load);
    };

    render() {
        if (this.state.firstLoad) {
            return <BigLoader/>;
        }

        return (
            <div style={{
                padding: '0 5px',
            }}>
                <RefreshTrigger
                    onRefresh={this.load}
                    refreshing={this.state.refreshing}
                />
                <div style={this.state.refreshing ? greyedOut : {}}>
                    <Row>
                        <Col push={{xs: 1}} xs={10}>
                            <IncludeDropdown
                                value={this.state.include}
                                onChange={this.onIncludeChange}
                            />
                        </Col>
                    </Row>
                    {this.state.results && this.renderResults()}
                </div>
            </div>
        );
    }
}

export default connect(state => state)(Summary);