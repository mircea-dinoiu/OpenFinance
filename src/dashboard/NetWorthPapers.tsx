import {Table, TableHead, TableRow, TableCell, TableBody, Typography, Paper, Tooltip} from '@material-ui/core';
import {styled} from '@material-ui/core/styles';
import {NumericValue} from 'app/formatters';
import {BalanceByLocationInventory} from 'transactions/defs';
import React from 'react';
import {useProperties} from 'properties/state';
import {useCurrenciesMap} from 'currencies/state';
import _ from 'lodash';
import {Info as IconInfo} from '@material-ui/icons';

export const NetWorthPapers = ({
    cashByCurrencyId,
    inventoriesByCurrencyId,
    investmentsByCurrencyId,
    debtByCurrencyId,
    className,
}: {
    cashByCurrencyId: Record<string, number>;
    inventoriesByCurrencyId: Record<string, BalanceByLocationInventory[]>;
    investmentsByCurrencyId: Record<string, number>;
    debtByCurrencyId: Record<string, number>;
    className: string;
}) => {
    const {data: properties} = useProperties();
    const currenciesMap = useCurrenciesMap();
    const propertiesByCurrencyId = _.groupBy(properties, 'currency_id');
    const currencies = _.uniq(
        _.sortBy(
            [
                ...Object.keys(propertiesByCurrencyId).map(Number),
                ...Object.keys(cashByCurrencyId).map(Number),
                ...Object.keys(investmentsByCurrencyId).map(Number),
                ...Object.keys(debtByCurrencyId).map(Number),
            ],
            (id) => currenciesMap[id].iso_code,
        ),
    );

    return (
        <>
            {currencies.map((currencyId) => {
                const valueProperties = _.sumBy(propertiesByCurrencyId[currencyId], 'market_value');
                const valueCash = cashByCurrencyId[currencyId] ?? 0;
                const valueInvestments = investmentsByCurrencyId[currencyId] ?? 0;
                const valueDebt = debtByCurrencyId[currencyId] ?? 0;
                const inventories = inventoriesByCurrencyId[currencyId] ?? [];
                const total = valueCash + valueInvestments + valueProperties + valueDebt;

                return (
                    total > 0 && (
                        <Paper className={className}>
                            <Table size="small" padding="none">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <Typography variant="h6">
                                                {currenciesMap[currencyId].iso_code} Worth
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="h4">
                                                <NumericValue currency={currencyId} value={total} />
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <NetWorthTableRow label={'Cash'} value={valueCash} currencyId={currencyId} />
                                    <NetWorthTableRow
                                        label={'Investments'}
                                        value={valueInvestments}
                                        currencyId={currencyId}
                                    />
                                    <NetWorthTableRow
                                        label={'Properties'}
                                        value={valueProperties}
                                        currencyId={currencyId}
                                    />
                                    {inventories.map((inv) => (
                                        <NetWorthTableRow
                                            label={
                                                <InventoryLabel>
                                                    <span>Inventory: {inv.name}</span>
                                                    <Tooltip title="Not Included in Worth" placement="top">
                                                        <IconInfo fontSize="inherit" />
                                                    </Tooltip>
                                                </InventoryLabel>
                                            }
                                            value={inv.sum}
                                            currencyId={currencyId}
                                        />
                                    ))}
                                    <NetWorthTableRow label={'Debt'} value={valueDebt} currencyId={currencyId} />
                                </TableBody>
                            </Table>
                        </Paper>
                    )
                );
            })}
        </>
    );
};

const InventoryLabel = styled('span')((props) => ({
    display: 'flex',
    gridGap: props.theme.spacing(1),
    alignItems: 'center',
}));

const NetWorthTableRow = ({
    label,
    value,
    currencyId,
}: {
    label: string | JSX.Element;
    value: number;
    currencyId: number;
}) => {
    return (
        <>
            {value !== 0 && (
                <TableRow>
                    <TableCell>{label}</TableCell>
                    <TableCell align="right">
                        <NumericValue currency={currencyId} value={value} />
                    </TableCell>
                </TableRow>
            )}
        </>
    );
};
