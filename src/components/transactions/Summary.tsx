import * as React from 'react';
import {createXHR} from 'utils/fetch';
import {Checkbox, FormControlLabel, Paper} from '@material-ui/core';
import {green, purple, red} from '@material-ui/core/colors';
import {routes} from 'defs/routes';
import pickBy from 'lodash/pickBy';
import identity from 'lodash/identity';
import {IncludeDropdown} from 'components/IncludeDropdown';
import {getStartDate} from 'utils/dates';
import {spacingMedium} from 'defs/styles';
import {SummaryCategory} from 'components/transactions/summary/SummaryCategory';
import moment from 'moment';
import {endOfDayToISOString} from 'js/utils/dates';
import {MoneyLocationDisplay} from 'components/BaseTable/cells/MoneyLocationDisplay';
import {makeUrl} from 'utils/url';
import {
    useCategories,
    useMoneyLocations,
    useMoneyLocationTypes,
    usePreferencesWithActions,
    useRefreshWidgets,
    useScreenSize,
    useUsers,
} from 'state/hooks';
import {SummaryLazyCategory} from './summary/SummaryLazyCategory';
import {LoadingTopBar} from '../loaders';

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

export const Summary = () => {
    const [results, setResults] = React.useState(null);
    const [refreshing, setRefreshing] = React.useState(false);
    const [preferences, {updatePreferences}] = usePreferencesWithActions();
    const refreshWidgets = useRefreshWidgets();
    const moneyLocationTypes = useMoneyLocationTypes();
    const user = useUsers();
    const categories = useCategories();
    const moneyLocations = useMoneyLocations();
    const includePending = preferences.includePending;
    const endDate = preferences.endDate;
    const include = preferences.include;
    const reportQueryParams = new URLSearchParams({
        ...pickBy(
            {
                end_date: getEndDateBasedOnIncludePreference(endDate, include),
                start_date: getStartDate({
                    include,
                    endDate,
                }),
            },
            identity,
        ),
        include_pending: String(includePending),
        filters: JSON.stringify(
            includePending ? [] : [{id: 'status', value: 'finished'}],
        ),
    }).toString();

    const load = async () => {
        setRefreshing(true);

        const response = await createXHR({
            url: makeUrl(routes.reports.summary, reportQueryParams),
        });
        const json = response.data;

        setResults(json);
        setRefreshing(false);
    };

    React.useEffect(() => {
        load();
    }, [reportQueryParams, refreshWidgets]);

    const renderCategory = (categoryProps) =>
        React.createElement(SummaryCategory, categoryProps);

    const onIncludeChange = (include) => {
        updatePreferences({include});
    };

    const handleToggleIncludePending = () => {
        const includePending = !preferences.includePending;

        updatePreferences({includePending});
    };

    const parseTransactionsByLocation = (data) => {
        return Object.entries(data)
            .map(([key, sum]) => {
                const ml = moneyLocations.find((ml) => ml.id === Number(key));

                if (!ml || sum === 0) {
                    return null;
                }

                return {
                    currencyId: ml.currency_id,
                    description: ml.name,
                    group: ml.type_id,
                    reference: key,
                    sum,
                };
            })
            .filter(Boolean);
    };

    return (
        <div
            style={{
                padding: '0 5px',
            }}
        >
            {refreshing && <LoadingTopBar />}
            <>
                <Paper
                    style={{
                        padding: `0 ${spacingMedium}`,
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
                <div style={{margin: '0 0 20px'}}>
                    <SummaryLazyCategory
                        {...{
                            backgroundColor: green[500],
                            title: 'Balance by Account',
                            entities: moneyLocationTypes,
                            expandedByDefault: true,
                            url: makeUrl(
                                routes.reports.balanceByLocation,
                                reportQueryParams,
                            ),
                            parser: parseTransactionsByLocation,
                            renderDescription({reference}) {
                                return <MoneyLocationDisplay id={reference} />;
                            },
                        }}
                    />
                    {results &&
                        renderCategory({
                            backgroundColor: green[500],
                            title: 'Balance by Person',
                            summaryObject: results.remainingData.byUser,
                            entities: user.list,
                            entityNameField: 'full_name',
                        })}

                    {results &&
                        renderCategory({
                            backgroundColor: purple[500],
                            title: 'Transactions by Category',
                            summaryObject: results.expensesByCategory,
                            entities: categories,
                            entityNameField: 'name',
                            showSumInHeader: false,
                        })}

                    <SummaryLazyCategory
                        {...{
                            backgroundColor: red[500],
                            title: 'Expenses by Account',
                            entities: moneyLocationTypes,
                            entityNameField: 'name',
                            url: makeUrl(
                                routes.reports.expensesByLocation,
                                reportQueryParams,
                            ),
                            parser: parseTransactionsByLocation,
                        }}
                    />

                    {results &&
                        renderCategory({
                            backgroundColor: red[500],
                            title: 'Expenses by Person',
                            summaryObject: results.expensesData.byUser,
                            entities: user.list,
                            entityNameField: 'full_name',
                        })}
                </div>
            </>
        </div>
    );
};
