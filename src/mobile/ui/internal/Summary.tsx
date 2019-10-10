import * as React from 'react';
import {createXHR} from 'common/utils/fetch';
import {BigLoader} from 'common/components/loaders';
import {Paper, Checkbox, FormControlLabel} from '@material-ui/core';
import {green, purple, red} from '@material-ui/core/colors';
import routes from '../../../common/defs/routes';
import pickBy from 'lodash/pickBy';
import identity from 'lodash/identity';
import IncludeDropdown from 'common/components/IncludeDropdown';
import {getStartDate} from 'common/utils/dates';
import {greyedOut} from 'common/defs/styles';
import {Sizes} from 'common/defs';
import SummaryCategory from 'mobile/ui/internal/summary/SummaryCategory';
import moment from 'moment';
import {endOfDayToISOString} from 'shared/utils/dates';
import MoneyLocationDisplay from 'common/components/BaseTable/cells/MoneyLocationDisplay';
import {makeUrl} from 'common/utils/url';
import {
    usePreferencesWithActions,
    useRefreshWidgets,
    useMoneyLocationTypes,
    useUser,
    useCategories,
    useScreenSize,
} from 'common/state/hooks';

const getEndDateBasedOnIncludePreference = (endDate, include) => {
    if (include === 'previous-year') {
        return endOfDayToISOString(
            moment(endDate)
                .month(0)
                .date(1)
                .subtract(1, 'day')
                .toDate(),
        );
    }

    if (include === 'next-year') {
        return endOfDayToISOString(
            moment(endDate)
                .month(0)
                .date(1)
                .add(2, 'year')
                .subtract(1, 'day')
                .toDate(),
        );
    }

    if (include === 'current-year') {
        return endOfDayToISOString(
            moment(endDate)
                .month(0)
                .date(1)
                .add(1, 'year')
                .subtract(1, 'day')
                .toDate(),
        );
    }

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

const Summary = () => {
    const [firstLoad, setFirstLoad] = React.useState(true);
    const [results, setResults] = React.useState(null);
    const [refreshing, setRefreshing] = React.useState(false);
    const [preferences, {updatePreferences}] = usePreferencesWithActions();
    const refreshWidgets = useRefreshWidgets();
    const moneyLocationTypes = useMoneyLocationTypes();
    const user = useUser();
    const categories = useCategories();
    const screenSize = useScreenSize();

    const load = async ({
        includePending = preferences.includePending,
        endDate = preferences.endDate,
        include = preferences.include,
    } = {}) => {
        setRefreshing(true);

        const response = await createXHR({
            url: makeUrl(routes.report.summary, {
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
                    includePending ? [] : [{id: 'status', value: 'finished'}],
                ),
            }),
        });
        const json = response.data;

        setResults(json);
        setFirstLoad(false);
        setRefreshing(false);
    };

    React.useEffect(() => {
        load();
    }, [preferences.endDate, refreshWidgets]);

    const renderCategory = (categoryProps) =>
        React.createElement(SummaryCategory, categoryProps);

    const renderResults = () => (
        <div style={{margin: '0 0 20px'}}>
            {renderCategory({
                backgroundColor: green[500],
                title: 'Balance by Account',
                summaryObject: results.remainingData.byML,
                entities: moneyLocationTypes,
                expandedByDefault: true,
                renderDescription({reference}) {
                    return <MoneyLocationDisplay id={reference} />;
                },
            })}

            {renderCategory({
                backgroundColor: green[500],
                title: 'Balance by Person',
                summaryObject: results.remainingData.byUser,
                entities: user.list,
                entityNameField: 'full_name',
            })}

            {renderCategory({
                backgroundColor: purple[500],
                title: 'Transactions by Category',
                summaryObject: results.expensesByCategory,
                entities: categories,
                entityNameField: 'name',
                showSumInHeader: false,
            })}

            {renderCategory({
                backgroundColor: red[500],
                title: 'Expenses by Account',
                summaryObject: results.expensesData.byML,
                entities: moneyLocationTypes,
                entityNameField: 'name',
            })}

            {renderCategory({
                backgroundColor: red[500],
                title: 'Expenses by Person',
                summaryObject: results.expensesData.byUser,
                entities: user.list,
                entityNameField: 'full_name',
            })}
        </div>
    );

    const onIncludeChange = (include) => {
        updatePreferences({include});
        load({include});
    };

    const handleToggleIncludePending = () => {
        const includePending = !preferences.includePending;

        updatePreferences({includePending});
        load({includePending});
    };

    if (firstLoad) {
        return <BigLoader />;
    }

    return (
        <div
            style={{
                padding: '0 5px',
                ...(screenSize.isLarge
                    ? {
                          overflowY: 'auto',
                          overflowX: 'hidden',
                          height: `calc(100vh - ${Sizes.HEADER_SIZE})`,
                      }
                    : {}),
            }}
        >
            <div style={refreshing ? greyedOut : {}}>
                <Paper
                    style={{
                        margin: '5px 0',
                        padding: '0 10px',
                    }}
                >
                    <IncludeDropdown
                        value={preferences.include}
                        onChange={onIncludeChange}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={preferences.includePending}
                                onChange={handleToggleIncludePending}
                                color="default"
                            />
                        }
                        label="Include pending transactions"
                    />
                </Paper>
                {results && renderResults()}
            </div>
        </div>
    );
};

export default Summary;
