// @flow
import React from 'react';
import { createXHR } from 'common/utils/fetch';
import { BigLoader } from '../components/loaders';
import { Paper, Checkbox, FormControlLabel } from '@material-ui/core';
import { green, purple, red, lime } from '@material-ui/core/colors';
import routes from '../../../common/defs/routes';
import { stringify } from 'query-string';
import pickBy from 'lodash/pickBy';
import identity from 'lodash/identity';
import { connect } from 'react-redux';
import IncludeDropdown from 'common/components/IncludeDropdown';
import { getStartDate } from 'common/utils/dates';
import { greyedOut } from 'common/defs/styles';
import { Sizes } from 'common/defs';
import SummaryCategory from 'mobile/ui/internal/summary/SummaryCategory';
import { updatePreferences } from 'common/state/actions';
import moment from 'moment';
import { endOfDayToISOString } from 'shared/utils/dates';

type TypeProps = {
    screen: TypeScreenQueries,
};

const getEndDateBasedOnIncludePreference = (endDate, include) => {
    if (include === 'ut') {
        return endOfDayToISOString();
    }

    if (include === 'until-tmrw') {
        return endOfDayToISOString(
            moment()
                .add(1, 'day')
                .toDate(),
        );
    }

    if (include === 'until-yd') {
        return endOfDayToISOString(
            moment()
                .subtract(1, 'day')
                .toDate(),
        );
    }

    if (include === 'until-now') {
        return moment().toISOString();
    }

    return endDate;
};

class Summary extends React.PureComponent<TypeProps> {
    state = {
        firstLoad: true,
        results: null,
        refreshing: false,
    };

    componentDidMount() {
        this.load();
    }

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps({ preferences, refreshWidgets }) {
        const { endDate } = preferences;

        if (endDate !== this.props.preferences.endDate) {
            this.load({ endDate });
        }

        if (refreshWidgets !== this.props.refreshWidgets) {
            this.load();
        }
    }

    load = async ({
        includePending = this.props.preferences.includePending,
        endDate = this.props.preferences.endDate,
        include = this.props.preferences.include,
    } = {}) => {
        this.setState({
            refreshing: true,
        });

        const response = await createXHR({
            url: `${routes.report.summary}?${stringify({
                ...pickBy(
                    {
                        end_date: getEndDateBasedOnIncludePreference(
                            endDate,
                            include,
                        ),
                        start_date: getStartDate({
                            include,
                            endDate,
                        }),
                    },
                    identity,
                ),
                html: false,
                filters: JSON.stringify(
                    includePending ? [] : [{ id: 'status', value: 'finished' }],
                ),
            })}`,
        });
        const json = response.data;

        this.setState({
            results: json,
            firstLoad: false,
            refreshing: false,
        });
    };

    renderCategory(props) {
        return React.createElement(SummaryCategory, props);
    }

    renderResults() {
        const { results } = this.state;

        return (
            <div style={{ margin: '0 0 20px' }}>
                {this.renderCategory({
                    backgroundColor: green[500],
                    title: 'Balance by Account',
                    summaryObject: results.remainingData.byML,
                    entities: this.props.moneyLocationTypes,
                    expandedByDefault: true,
                })}

                {this.renderCategory({
                    backgroundColor: green[500],
                    title: 'Balance by Person',
                    summaryObject: results.remainingData.byUser,
                    entities: this.props.user.get('list'),
                    entityNameField: 'full_name',
                })}

                {this.renderCategory({
                    backgroundColor: purple[500],
                    title: 'Transactions by Category',
                    summaryObject: results.expensesByCategory,
                    entities: this.props.categories,
                    entityNameField: 'name',
                    showSumInHeader: false,
                })}

                {this.renderCategory({
                    backgroundColor: red[500],
                    title: 'Expenses by Account',
                    summaryObject: results.expensesData.byML,
                    entities: this.props.moneyLocationTypes,
                    entityNameField: 'name',
                })}

                {this.renderCategory({
                    backgroundColor: red[500],
                    title: 'Expenses by Person',
                    summaryObject: results.expensesData.byUser,
                    entities: this.props.user.get('list'),
                    entityNameField: 'full_name',
                })}
            </div>
        );
    }

    onIncludeChange = (include) => {
        this.props.updatePreferences({ include });
        this.load({ include });
    };

    handleToggleIncludePending = () => {
        const includePending = !this.props.preferences.includePending;

        this.props.updatePreferences({ includePending });
        this.load({ includePending });
    };

    render() {
        if (this.state.firstLoad) {
            return <BigLoader />;
        }

        return (
            <div
                style={{
                    padding: '0 5px',
                    ...(this.props.screen.isLarge
                        ? {
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            height: `calc(100vh - ${Sizes.HEADER_SIZE})`,
                        }
                        : {}),
                }}
            >
                <div style={this.state.refreshing ? greyedOut : {}}>
                    <Paper
                        style={{
                            margin: '5px 0',
                            padding: '0 10px',
                        }}
                    >
                        <IncludeDropdown
                            value={this.props.preferences.include}
                            onChange={this.onIncludeChange}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={
                                        this.props.preferences.includePending
                                    }
                                    onChange={this.handleToggleIncludePending}
                                    color="default"
                                />
                            }
                            label="Include pending transactions"
                        />
                    </Paper>
                    {this.state.results && this.renderResults()}
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = { updatePreferences };

export default connect(
    (state) => state,
    mapDispatchToProps,
)(Summary);
