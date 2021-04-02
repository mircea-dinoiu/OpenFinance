import {
    Card,
    CardContent,
    useTheme,
    FormControlLabel,
    Checkbox,
    Divider,
    FormGroup,
    Paper,
    List,
    ListItem,
    ListItemText,
} from '@material-ui/core';
import {useCategories} from 'categories/state';
import {DashboardGridWithSidebar} from 'dashboard/DashboardGridWithSidebar';
import {CurrencyFilter} from 'dashboard/filters/CurrencyFilter';
import {formatCurrency} from 'app/formatters';
import {Api} from 'app/Api';
import moment from 'moment';
import React, {useState} from 'react';
import {useCurrenciesMap} from 'currencies/state';
import {useSelectedProject} from 'projects/state';
import {createXHR} from 'app/fetch';
import {makeUrl} from 'app/url';
import _, {sortBy, sumBy, omit} from 'lodash';
import {Cell, ResponsiveContainer, PieChart, Pie} from 'recharts';
import * as allColors from '@material-ui/core/colors';
import {green} from '@material-ui/core/colors';
import {makeStyles} from '@material-ui/core/styles';

const colors = Object.values(omit(allColors, 'brown', 'green', 'common'))
    .map((color) => color[300])
    .flat();

type CashFlowEntry = {
    currency_id: number;
    category_id: number;
    sum: number;
};

type CashFlowResponse = {
    data: Record<number, CashFlowEntry[]>;
};

export const CashFlow = () => {
    const cls = useStyles();
    const theme = useTheme();
    const [dateYear, setDateYear] = useState(new Date().getFullYear());
    const [dateMonth, setDateMonth] = useState(new Date().getMonth());
    const [response, setResponse] = useState<CashFlowResponse | undefined>();
    const project = useSelectedProject();
    const categories = sortBy(useCategories(), 'name');
    const categoriesById = categories.reduce((acc, c) => ({...acc, [c.id]: c}), {});
    const currencyIds = response ? Object.keys(response.data) : [];
    const [currencyIdOverride, setCurrencyIdOverride] = useState('');
    const currencyId = currencyIdOverride || currencyIds[0];
    const currenciesMap = useCurrenciesMap();
    const [displaySavings, setDisplaySavings] = useState(true);
    const [excludedCategoryIds, setExcludedCategoryIds] = useState<Record<number, boolean>>({});

    const dataForCurrency: Array<{
        name: string;
        value: number;
        id?: number;
        label: string;
        isIncome: boolean;
    }> = (response?.data[currencyId] ?? []).map((entry: CashFlowEntry) => {
        const categoryName = categoriesById[entry.category_id]?.name ?? '(Uncategorized)';
        const value = excludedCategoryIds[entry.category_id] === true ? 0 : Math.abs(entry.sum);
        const formattedValue = formatCurrency(value, currenciesMap[entry.currency_id].iso_code);

        return {
            id: entry.category_id,
            label: categoryName ? `${categoryName}: ${formattedValue}` : formattedValue,
            name: categoryName,
            value,
            isIncome: entry.sum > 0,
        };
    });
    const dataIncome = dataForCurrency.filter((d) => d.isIncome);
    let dataExpense = dataForCurrency.filter((d) => !d.isIncome);
    const dataIncomeSum = sumBy(dataIncome, 'value');
    let dataExpenseSum = sumBy(dataExpense, 'value');
    const savedIncome = dataIncomeSum - dataExpenseSum;

    const url = makeUrl(Api.reports.cashFlow, {
        end_date: moment(new Date(dateYear, dateMonth ?? 0))
            .endOf(dateMonth === undefined ? 'year' : 'month')
            .toISOString(),
        start_date: moment(new Date(dateYear, dateMonth ?? 0))
            .startOf(dateMonth === undefined ? 'year' : 'month')
            .toISOString(),
        projectId: project.id,
        include_pending: true,
    });

    if (savedIncome > 0 && displaySavings) {
        dataExpense = [
            ...dataExpense,
            {
                label: 'Savings: ' + formatCurrency(savedIncome, currenciesMap[currencyId].iso_code),
                name: 'Savings',
                value: savedIncome,
                isIncome: true,
            },
        ];
    }

    dataExpenseSum = sumBy(dataExpense, 'value');

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
                            <CurrencyFilter ids={currencyIds} selected={currencyId} onChange={setCurrencyIdOverride} />

                            <div className={cls.dateContainer}>
                                <Paper variant="outlined">
                                    <DateSelector
                                        options={_.range(dateYear - 5, dateYear + 7).map((y) => ({
                                            label: y.toString(),
                                            value: y,
                                        }))}
                                        value={dateYear}
                                        onChange={setDateYear}
                                    />
                                </Paper>
                                <Paper variant="outlined">
                                    <DateSelector
                                        isClearable={true}
                                        options={moment.monthsShort().map((m, i) => ({
                                            label: m,
                                            value: i,
                                        }))}
                                        value={dateMonth}
                                        onChange={setDateMonth}
                                    />
                                </Paper>
                            </div>
                        </>
                    }
                >
                    {response && (
                        <Card style={{backgroundColor: theme.palette.background.default}}>
                            <CardContent style={{display: 'grid', gridTemplateColumns: 'auto 1fr'}}>
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={displaySavings}
                                                onChange={() => setDisplaySavings(!displaySavings)}
                                            />
                                        }
                                        label="Savings"
                                    />

                                    <Divider />

                                    {dataExpense.map(
                                        (entry) =>
                                            entry.id && (
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={excludedCategoryIds[entry.id] !== true}
                                                            onChange={(event) =>
                                                                setExcludedCategoryIds({
                                                                    ...excludedCategoryIds,
                                                                    [String(entry.id)]: !event.target.checked,
                                                                })
                                                            }
                                                        />
                                                    }
                                                    label={entry.name}
                                                />
                                            ),
                                    )}
                                </FormGroup>
                                <ResponsiveContainer minHeight="500px" height="100%" width="100%">
                                    <PieChart>
                                        <Pie
                                            data={dataExpense}
                                            label={({index}) =>
                                                dataExpense[index].label +
                                                ' | ' +
                                                Math.ceil((dataExpense[index].value / dataExpenseSum) * 100) +
                                                '%'
                                            }
                                            dataKey="value"
                                            stroke={theme.palette.background.default}
                                        >
                                            {dataExpense.map((entry, index) => (
                                                <Cell key={index} fill={entry.isIncome ? green[300] : colors[index]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    )}
                </DashboardGridWithSidebar>
            </CardContent>
        </Card>
    );
};

const useStyles = makeStyles((theme) => ({
    dateContainer: {
        display: 'grid',
        gridGap: theme.spacing(1),
        gridTemplateColumns: '1fr 1fr',
        height: '100%',
    },
}));

const DateSelector = <Value,>({
    options,
    value,
    onChange,
    isClearable,
}: {
    options: {value: Value; label: string}[];
    value: Value;
    onChange: (value: Value) => void;
    isClearable?: boolean;
}) => (
    <List dense={true}>
        {options.map((o) => {
            const isSelected = o.value === value;

            return (
                <ListItem
                    button
                    selected={isSelected}
                    onClick={() => {
                        if (isClearable && value === o.value) {
                            // @ts-ignore
                            onChange(undefined);
                        } else {
                            onChange(o.value);
                        }
                    }}
                >
                    <ListItemText primary={o.label} />
                </ListItem>
            );
        })}
    </List>
);
