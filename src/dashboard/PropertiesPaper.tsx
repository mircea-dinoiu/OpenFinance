import {TProperty} from 'properties/defs';
import {useProperties} from 'properties/state';
import React from 'react';
import {CardHeader, Paper, CardContent, Card} from '@material-ui/core';
import HouseIcon from '@material-ui/icons/House';
import {BaseTable} from 'app/BaseTable';
import {Column} from 'react-table-6';
import {financialNum} from 'app/numbers';
import Decimal from 'decimal.js';
import {locales} from 'app/locales';
import {BigLoader} from 'app/loaders';
import {firstColumnStyles} from 'app/styles/column';
import {createNumericColumn, createNumericColumnX} from 'app/createNumericColumn';
import {XGrid, GridColDef} from '@material-ui/x-grid';

export const PropertiesPaper = ({
    classes,
}: {
    classes: {
        cardHeader: string;
        paper: string;
    };
}) => {
    const {data: properties, isLoaded} = useProperties();

    if (!isLoaded) {
        return <BigLoader />;
    }

    if (properties.length === 0) {
        return (
            <Card>
                <CardContent>{locales.nothingToSeeHereYet}</CardContent>
            </Card>
        );
    }

    return (
        <Paper className={classes.paper}>
            <CardHeader
                className={classes.cardHeader}
                title={
                    <>
                        <HouseIcon /> Properties
                    </>
                }
            />

            <XGrid
                autoHeight={true}
                rows={properties}
                columns={[NameCol, ValueCol, CostCol, ChangeCol, ChangePercCol]}
            />
        </Paper>
    );
};

const NameCol: GridColDef = {
    headerName: 'Name',
    field: 'name',
    flex: 1,
};

const ValueCol = createNumericColumnX<TProperty>({
    headerName: 'Value',
    field: 'market_value',
});

const CostCol = createNumericColumnX<TProperty>(
    {
        headerName: 'Cost',
        field: 'cost',
    },
    {
        colorize: false,
    },
);

const ChangeCol = createNumericColumnX<TProperty>({
    headerName: 'Change $',
    field: 'change',
    valueGetter: (params) => {
        const p = params.row as TProperty;

        return new Decimal(p.market_value).minus(p.cost).toNumber();
    },
});

const ChangePercCol = createNumericColumnX<TProperty>(
    {
        headerName: 'Change %',
        field: 'changePerc',
        valueGetter: (params) => {
            const p = params.row as TProperty;

            const value = new Decimal(p.market_value);

            return financialNum(
                value
                    .minus(p.cost)
                    .div(p.cost)
                    .times(100)
                    .toNumber(),
            );
        },
    },
    {
        after: '%',
    },
);
