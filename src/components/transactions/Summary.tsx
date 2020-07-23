import {Checkbox, FormControlLabel, Paper} from '@material-ui/core';
import {green, purple, red} from '@material-ui/core/colors';
import {makeStyles} from '@material-ui/core/styles';
import {MoneyLocationDisplay} from 'components/BaseTable/cells/MoneyLocationDisplay';
import {IncludeDropdown} from 'components/include-dropdown/IncludeDropdown';
import {
    getEndDateBasedOnIncludePreference,
    useInclude,
    useIncludePending,
} from 'components/transactions/helpers';
import {SummaryCategory} from 'components/transactions/SummaryCategory';
import {SummaryLazyCategory} from 'components/transactions/SummaryLazyCategory';
import {IncludeOption, TransactionStatus} from 'defs';
import {routes} from 'defs/routes';
import {spacingMedium, spacingSmall} from 'defs/styles';
import identity from 'lodash/identity';
import pickBy from 'lodash/pickBy';
import * as React from 'react';
import {
    useCategories,
    useMoneyLocations,
    useMoneyLocationTypes,
    useRefreshWidgets,
    useUsers,
} from 'state/hooks';
import {getStartDate, useEndDate} from 'utils/dates';
import {createXHR} from 'utils/fetch';
import {makeUrl} from 'utils/url';
import {LoadingTopBar} from '../loaders';

const useStyles = makeStyles({
    sidebar: {
        display: 'grid',
        gridGap: spacingSmall,
        gridTemplateColumns: '1fr',
    },
});

type Results = {
    remainingData: {
        byUser: {};
    };
    expensesData: {
        byUser: {};
    };
    expensesByCategory: {};
};

export const Summary = () => {
    const cls = useStyles();
    const [results, setResults] = React.useState<Results | null>(null);
    const [refreshing, setRefreshing] = React.useState(false);
    const refreshWidgets = useRefreshWidgets();
    const moneyLocationTypes = useMoneyLocationTypes();
    const user = useUsers();
    const categories = useCategories();
    const moneyLocations = useMoneyLocations();
    const [includePending, setIncludePending] = useIncludePending();
    const [endDate] = useEndDate();
    const [include, setInclude] = useInclude();
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

        const response = await createXHR<Results>({
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
        setInclude(value);
    };

    const handleToggleIncludePending = () => {
        setIncludePending(!includePending);
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
            <div className={cls.sidebar}>
                <Paper
                    style={{
                        padding: spacingMedium,
                    }}
                >
                    <IncludeDropdown
                        value={include}
                        onChange={onIncludeChange}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={includePending}
                                onChange={handleToggleIncludePending}
                                color="default"
                            />
                        }
                        label="Include pending transactions"
                    />
                </Paper>
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
        </div>
    );
};
