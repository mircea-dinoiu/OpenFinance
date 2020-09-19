import {Checkbox, FormControlLabel, Paper} from '@material-ui/core';
import {green, purple} from '@material-ui/core/colors';
import {makeStyles} from '@material-ui/core/styles';
import {AccountDisplayById} from 'components/BaseTable/cells/AccountDisplayById';
import {IncludeDropdown} from 'components/include-dropdown/IncludeDropdown';
import {
    getEndDateBasedOnIncludePreference,
    useInclude,
    useIncludePending,
} from 'components/transactions/helpers';
import {SummaryCategory} from 'components/transactions/SummaryCategory';
import {SummaryLazyCategory} from 'components/transactions/SummaryLazyCategory';
import {
    BalanceByLocation,
    SummaryModel,
    SummaryResults,
} from 'components/transactions/types';
import {TransactionStatus} from 'defs';
import {routes} from 'defs/routes';
import {spacingNormal, spacingSmall} from 'defs/styles';
import identity from 'lodash/identity';
import pickBy from 'lodash/pickBy';
import * as React from 'react';
import {useAccounts} from 'state/accounts';
import {
    useCategories,
    useMoneyLocationTypes,
    useRefreshWidgets,
} from 'state/hooks';
import {useSelectedProject} from 'state/projects';
import {SummaryKey} from 'state/summary';
import {AccountType, User} from 'types';
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

export const Summary = () => {
    const cls = useStyles();
    const [results, setResults] = React.useState<SummaryResults | null>(null);
    const [refreshing, setRefreshing] = React.useState(false);
    const refreshWidgets = useRefreshWidgets();
    const moneyLocationTypes = useMoneyLocationTypes();
    const users = useSelectedProject().users;
    const categories = useCategories();
    const moneyLocations = useAccounts();
    const [includePending, setIncludePending] = useIncludePending();
    const [endDate] = useEndDate();
    const [include, setInclude] = useInclude();
    const project = useSelectedProject();
    const reportQueryParams = new URLSearchParams({
        ...pickBy(
            {
                end_date: getEndDateBasedOnIncludePreference(endDate, include),
                start_date: getStartDate({
                    include,
                    endDate,
                }),
                projectId: project.id,
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

        const response = await createXHR<SummaryResults>({
            url: makeUrl(routes.reports.summary, reportQueryParams),
        });
        const json = response.data;

        setResults(json);
        setRefreshing(false);
    };

    React.useEffect(() => {
        load();
    }, [reportQueryParams, refreshWidgets]);

    const handleToggleIncludePending = () => {
        setIncludePending(!includePending);
    };

    const parseTransactionsByLocation = (
        data: BalanceByLocation,
    ): SummaryModel[] => {
        const arr: SummaryModel[] = [];

        for (const each of data.cash) {
            const {money_location_id: id, sum: cashValue} = each;
            const ml = moneyLocations.find((ml) => ml.id === Number(id));

            if (ml) {
                arr.push({
                    currencyId: ml.currency_id,
                    description: ml.name,
                    group: ml.type_id,
                    reference: String(id),
                    cashValue,
                    stocks: data.stocks.filter(
                        (d) => d.money_location_id === id,
                    ),
                });
            }
        }

        return arr;
    };

    return (
        <div>
            {refreshing && <LoadingTopBar />}
            <div className={cls.sidebar}>
                <Paper
                    style={{
                        padding: spacingNormal,
                    }}
                >
                    <IncludeDropdown
                        value={include}
                        onChange={(option) => {
                            setInclude(option.value);
                        }}
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
                <SummaryLazyCategory<BalanceByLocation, AccountType>
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
                        renderDescription({reference}: {reference: string}) {
                            return <AccountDisplayById id={reference} />;
                        },
                        globalStateKey: SummaryKey.BALANCE_BY_ACCOUNT,
                        entityNameField: 'name',
                    }}
                />
                {results && (
                    <SummaryCategory<User>
                        {...{
                            backgroundColor: green[500],
                            title: 'Balance by Person',
                            summaryObject: results.remainingData.byUser,
                            entities: users,
                            entityNameField: 'full_name',
                        }}
                    />
                )}

                {results && (
                    <SummaryCategory
                        {...{
                            backgroundColor: purple[500],
                            title: 'Transactions by Category',
                            summaryObject: results.expensesByCategory,
                            entities: categories,
                            entityNameField: 'name',
                            showSumInHeader: false,
                        }}
                    />
                )}
            </div>
        </div>
    );
};
