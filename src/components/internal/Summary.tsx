import * as React from 'react';
import {createXHR} from 'utils/fetch';
import {Checkbox, FormControlLabel, Paper} from '@material-ui/core';
import {green, purple, red} from '@material-ui/core/colors';
import routes from 'defs/routes';
import pickBy from 'lodash/pickBy';
import identity from 'lodash/identity';
import IncludeDropdown from 'components/IncludeDropdown';
import {getStartDate} from 'utils/dates';
import {greyedOut, spacingMedium, spacingSmall} from 'defs/styles';
import {Sizes} from 'defs';
import SummaryCategory from 'components/internal/summary/SummaryCategory';
import moment from 'moment';
import {endOfDayToISOString} from 'js/utils/dates';
import MoneyLocationDisplay from 'components/BaseTable/cells/MoneyLocationDisplay';
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
import {objectEntriesOfSameType} from '../../utils/collection';
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

const Summary = () => {
    const [results, setResults] = React.useState(null);
    const [refreshing, setRefreshing] = React.useState(false);
    const [preferences, {updatePreferences}] = usePreferencesWithActions();
    const refreshWidgets = useRefreshWidgets();
    const moneyLocationTypes = useMoneyLocationTypes();
    const user = useUsers();
    const categories = useCategories();
    const screenSize = useScreenSize();
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
        include_pending: includePending,
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

    const renderResults = () => (
        <>
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
        </>
    );

    const onIncludeChange = (include) => {
        updatePreferences({include});
    };

    const handleToggleIncludePending = () => {
        const includePending = !preferences.includePending;

        updatePreferences({includePending});
    };

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
            {refreshing && <LoadingTopBar />}
            <>
                <Paper
                    style={{
                        margin: `${spacingSmall} 0`,
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
                            deps: [reportQueryParams, refreshWidgets],
                            url: makeUrl(
                                routes.reports.balanceByLocation,
                                reportQueryParams,
                            ),
                            parser: (data) => {
                                return objectEntriesOfSameType(data)
                                    .map(([key, sum]) => {
                                        const ml = moneyLocations.find(
                                            (ml) => ml.id === Number(key),
                                        );

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
                            },
                            renderDescription({reference}) {
                                return <MoneyLocationDisplay id={reference} />;
                            },
                        }}
                    />
                    {results && renderResults()}
                </div>
            </>
        </div>
    );
};

export default Summary;
