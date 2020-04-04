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
import {SummaryCategory} from 'components/transactions/SummaryCategory';
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
    useUsers,
} from 'state/hooks';
import {SummaryLazyCategory} from 'components/transactions/SummaryLazyCategory';
import {LoadingTopBar} from '../loaders';
import {TransactionStatus, IncludeOption} from 'defs';

const getEndDateBasedOnIncludePreference = (
    endDate,
    include: IncludeOption,
) => {
    if (include === IncludeOption.previousYear) {
        return endOfDayToISOString(
            moment(endDate)
                .month(0)
                .date(1)
                .subtract(1, 'day')
                .toDate(),
        );
    }

    if (include === IncludeOption.nextYear) {
        return endOfDayToISOString(
            moment(endDate)
                .month(0)
                .date(1)
                .add(2, 'year')
                .subtract(1, 'day')
                .toDate(),
        );
    }

    if (include === IncludeOption.currentYear) {
        return endOfDayToISOString(
            moment(endDate)
                .month(0)
                .date(1)
                .add(1, 'year')
                .subtract(1, 'day')
                .toDate(),
        );
    }

    if (include === IncludeOption.untilToday) {
        return endOfDayToISOString();
    }

    if (include === IncludeOption.untilTomorrow) {
        return endOfDayToISOString(
            moment()
                .add(1, 'day')
                .toDate(),
        );
    }

    if (include === IncludeOption.untilYesterday) {
        return endOfDayToISOString(
            moment()
                .subtract(1, 'day')
                .toDate(),
        );
    }

    if (include === IncludeOption.untilNow) {
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
            includePending
                ? []
                : [{id: 'status', value: TransactionStatus.finished}],
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

    const onIncludeChange = ({value}: {value: IncludeOption}) => {
        updatePreferences({include: value});
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
        <div>
            {refreshing && <LoadingTopBar />}
            <>
                <Paper
                    style={{
                        padding: spacingMedium,
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
