import {
    Card,
    CardContent,
    Checkbox,
    Divider,
    FormControlLabel,
    FormGroup,
    List,
    ListItem,
    ListItemText,
    Paper,
    useTheme,
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import SortIcon from '@material-ui/icons/Sort';
import {ToggleButton, ToggleButtonGroup} from '@material-ui/lab';
import {Api} from 'app/Api';
import {createXHR} from 'app/fetch';
import {formatCurrency} from 'app/formatters';
import {makeUrl} from 'app/url';
import {useCategories} from 'categories/state';
import {useCurrenciesMap} from 'currencies/state';
import {CategoryFilterLabelText} from 'dashboard/cashFlow/CategoryFilterLabelText';
import {DashboardGridWithSidebar} from 'dashboard/DashboardGridWithSidebar';
import {CurrencyFilter} from 'dashboard/filters/CurrencyFilter';
import _, {sortBy, sumBy} from 'lodash';
import moment from 'moment';
import {useSelectedProject} from 'projects/state';
import React, {useState} from 'react';
import {ResponsiveContainer, Tooltip, Treemap} from 'recharts';
import {COLOR_PANEL} from 'recharts/src/util/Constants';

const colors = COLOR_PANEL;

type CashFlowEntry = {
    currency_id: number;
    category_id: number;
    sum: number;
};

type CashFlowResponse = {
    data: Record<number, CashFlowEntry[]>;
};

enum ChartDirection {
    ASC = 'asc',
    DESC = 'desc',
}

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
    const [displaySavings, setDisplaySavings] = useState(false);
    const [excludedCategoryIds, setExcludedCategoryIds] = useState<Record<number, boolean>>({});
    const [chartDirection, setChartDirection] = useState(ChartDirection.DESC);

    const dataForCurrency: Array<{
        name: string;
        value: number;
        id?: number | string;
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
    const chartData = dataExpense
        .filter((d) => d.value > 0)
        .map((d, i) => ({
            ...d,
            value: chartDirection === ChartDirection.DESC ? d.value : dataExpenseSum - d.value,
            color: d.isIncome ? theme.palette.common.white : colors[dataExpense.findIndex((de) => de.id === d.id)],
            name: `${d.label} (${Math.ceil((d.value / dataExpenseSum) * 100)}%)`,
        }));

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
                            <CardContent
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'auto auto 1fr',
                                    gridGap: theme.spacing(2),
                                }}
                            >
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={displaySavings}
                                                onChange={() => setDisplaySavings(!displaySavings)}
                                            />
                                        }
                                        label={
                                            <CategoryFilterLabelText
                                                indicatorColor={chartData.find((d) => d.isIncome)?.color}
                                            >
                                                Savings
                                            </CategoryFilterLabelText>
                                        }
                                    />

                                    <Divider />

                                    {dataExpense.map((entry) => {
                                        const {id} = entry;
                                        const chartItem = chartData.find((d) => d.id === id);

                                        return (
                                            id && (
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={excludedCategoryIds[id] !== true}
                                                            onChange={(event) =>
                                                                setExcludedCategoryIds({
                                                                    ...excludedCategoryIds,
                                                                    [String(entry.id)]: !event.target.checked,
                                                                })
                                                            }
                                                        />
                                                    }
                                                    label={
                                                        <CategoryFilterLabelText indicatorColor={chartItem?.color}>
                                                            {entry.name}
                                                        </CategoryFilterLabelText>
                                                    }
                                                />
                                            )
                                        );
                                    })}
                                </FormGroup>
                                <FormGroup>
                                    <ToggleButtonGroup
                                        orientation="vertical"
                                        value={chartDirection}
                                        exclusive
                                        onChange={(e, dir) => dir && setChartDirection(dir)}
                                    >
                                        <ToggleButton value={ChartDirection.DESC}>
                                            <SortIcon />
                                        </ToggleButton>
                                        <ToggleButton value={ChartDirection.ASC}>
                                            <SortIcon
                                                style={{
                                                    transform: 'scaleY(-1)',
                                                }}
                                            />
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </FormGroup>
                                <div
                                    style={{
                                        borderRadius: theme.shape.borderRadius,
                                        overflow: 'hidden',
                                    }}
                                >
                                    <ResponsiveContainer width="100%" minHeight={500}>
                                        <Treemap
                                            colorPanel={chartData.map((d) => d.color) as []}
                                            data={chartData}
                                            dataKey="value"
                                            stroke={theme.palette.background.paper}
                                            type="flat"
                                            animationDuration={250}
                                        >
                                            <Tooltip
                                                separator=""
                                                formatter={(value: string, name: string, props: any) =>
                                                    props.payload.name
                                                }
                                            />
                                        </Treemap>
                                    </ResponsiveContainer>
                                </div>
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
