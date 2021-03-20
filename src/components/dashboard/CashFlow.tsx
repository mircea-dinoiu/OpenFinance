import {
    Card,
    CardContent,
    useTheme,
    Radio,
    FormControlLabel,
    Checkbox,
    FormControl,
} from '@material-ui/core';
import {DatePicker} from '@material-ui/pickers';
import {DashboardGridWithSidebar} from 'components/dashboard/DashboardGridWithSidebar';
import {CurrencyFilter} from 'components/dashboard/filters/CurrencyFilter';
import {formatCurrency} from 'components/formatters';
import {routes} from 'defs/routes';
import moment from 'moment';
import React, {useState} from 'react';
import {useCurrenciesMap} from 'state/currencies';
import {useCategories} from 'state/hooks';
import {useSelectedProject} from 'state/projects';
import {createXHR} from 'utils/fetch';
import {makeUrl} from 'utils/url';
import {sortBy, sumBy, random, omit} from 'lodash';
import {
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ReferenceLine,
    ResponsiveContainer,
    PieChart,
    Pie,
} from 'recharts';
import * as allColors from '@material-ui/core/colors';
import {green} from '@material-ui/core/colors';

const colors = Object.values(omit(allColors, 'brown',  'green','common')).map(color => color[300]).flat();

type CashFlowEntry = {
    currency_id: number;
    category_id: number;
    sum: number;
};

type CashFlowResponse = {
    data: Record<number, CashFlowEntry[]>;
};

export const CashFlow = () => {
    const theme = useTheme();
    const [date, setDate] = useState(new Date());
    const [response, setResponse] = useState<CashFlowResponse | undefined>();
    const project = useSelectedProject();
    const categories = sortBy(useCategories(), 'name');
    const categoriesById = categories.reduce((acc, c) => ({...acc, [c.id]: c}), {});
    const currencyIds = response ? Object.keys(response.data) : [];
    const [currencyIdOverride, setCurrencyIdOverride] = useState('');
    const currencyId = currencyIdOverride || currencyIds[0];
    const currenciesMap = useCurrenciesMap();
    const [allYear, setAllYear] = useState(false);

    const dataForCurrency: Array<{
        name: string,
        value: number,
        label: string,
        isIncome: boolean
    }> = (response ? response.data[currencyId] : []).map((entry: CashFlowEntry) => {
        const categoryName = categoriesById[entry.category_id]?.name ?? '(Uncategorized)';
        const value = Math.abs(entry.sum);
        const formattedValue = formatCurrency(value, currenciesMap[entry.currency_id].iso_code);

        return {
            label: categoryName ? `${categoryName}: ${formattedValue}` : formattedValue,
            name: categoryName,
            value,
            isIncome: entry.sum > 0,
        };
    });
    const dataIncome = dataForCurrency.filter(d => d.isIncome);
    let dataExpense = dataForCurrency.filter(d => !d.isIncome);
    const dataIncomeSum = sumBy(dataIncome, 'value');
    const dataExpenseSum = sumBy(dataExpense, 'value');
    const savedIncome = dataIncomeSum - dataExpenseSum;

    const url = makeUrl(routes.reports.cashFlow, {
        end_date: moment(date)
            .endOf(allYear ? 'year' : 'month')
            .toISOString(),
        start_date: moment(date)
            .startOf(allYear ? 'year' : 'month')
            .toISOString(),
        projectId: project.id,
        include_pending: true,
    });

    if (savedIncome > 0) {
        dataExpense = [...dataExpense, {label: '(Saved): ' + formatCurrency(savedIncome, currenciesMap[currencyId].iso_code), name: '(Saved)', value: savedIncome, isIncome: true}]
    }

    React.useEffect(() => {
        createXHR<CashFlowResponse>({
            url,
        }).then((response) => {
            setResponse(response.data);
        });
    }, [url]);

    return (
        <Card>
            <CardContent>
                <DashboardGridWithSidebar
                    sidebar={
                        <>
                            <DatePicker
                                variant='static'
                                openTo='month'
                                label='Month/Year'
                                views={['month', 'year']}
                                value={date}
                                onChange={(d) => setDate(d as any)}
                            />

                            <br />

                            <FormControlLabel
                                style={{margin: 0}}
                                control={
                                    <Checkbox
                                        checked={allYear}
                                        onChange={() => setAllYear(!allYear)}
                                    />
                                }
                                label="All Year"
                            />

                            <br />

                            <CurrencyFilter ids={currencyIds} selected={currencyId}
                                            onChange={setCurrencyIdOverride} />
                        </>
                    }
                >
                    {response && (
                        <Card style={{backgroundColor: theme.palette.background.default}}>
                            <ResponsiveContainer height={500} width="100%">
                                <PieChart>
                                    <Pie
                                        data={dataExpense}
                                        label={({index}) => dataExpense[index].label}
                                        dataKey="value"
                                        stroke={theme.palette.background.default}
                                    >
                                        {dataExpense.map((entry, index) => (
                                            <Cell key={index} fill={entry.isIncome ? green[300] : colors[index]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>

                        </Card>
                    )}
                </DashboardGridWithSidebar>
            </CardContent>
        </Card>
    );
};
