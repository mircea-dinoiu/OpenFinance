import React from 'react';
import {BigLoader} from '../components/loaders';
import {List, Card, CardHeader, CardText} from 'material-ui';
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
import ResponsiveListItem from 'common/components/ResponsiveListItem';

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

    componentWillReceiveProps({endDate}) {
        if (endDate !== this.props.endDate) {
            this.load({endDate});
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

    numericValue(value) {
        const currencyISOCode = this.props.currencies.getIn(['map', String(this.props.currencies.get('default')), 'iso_code']);

        return numericValue(value, currencyISOCode);
    }

    renderCard({
                   backgroundColor,
                   title,
                   summaryObject,
                   entities,
                   entityIdField = 'id',
                   entityNameField = 'name'
               }) {
        const headerColor = 'rgba(255, 255, 255, 0.9)';

        return (
            <Card style={{backgroundColor, marginBottom: 10}}>
                <CardHeader style={{paddingBottom: 0}} title={<span style={{color: headerColor}}>{title}</span>}/>
                <CardText>
                    {Object.entries(groupBy(summaryObject, 'group')).map(([id, items]) => (
                        <Card style={{backgroundColor: id == 0 ? colors.grey200 : colors.white, marginBottom: 5}}>
                            {id != 0 && <CardHeader style={{paddingBottom: 0}}
                                                    title={entities.find(each => each.get(entityIdField) == id).get(entityNameField).toUpperCase()}/>}
                            <List>
                                {items.map(each => (
                                    <ResponsiveListItem
                                        primaryText={each.description}
                                        secondaryText={this.numericValue(each.sum)}
                                    />
                                ))}
                            </List>
                        </Card>
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
                {this.renderCard({
                    backgroundColor: balanceBg,
                    title: 'Balance by location',
                    summaryObject: remainingData.byML,
                    entities: this.props.moneyLocationTypes
                })}

                {this.renderCard({
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
                    <IncludeDropdown
                        value={this.state.include}
                        onChange={this.onIncludeChange}
                    />
                    {this.state.results && this.renderResults()}
                </div>
            </div>
        );
    }
}

export default connect(state => state)(Summary);