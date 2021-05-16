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
import {createNumericColumn} from 'app/createNumericColumn';

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

            <BaseTable data={properties as any} columns={[NameCol, ValueCol, CostCol, ChangeCol, ChangePercCol]} />
        </Paper>
    );
};

const NameCol: Column<TProperty> = {
    Header: 'Name',
    accessor: 'name',
    ...firstColumnStyles,
};

const ValueCol = createNumericColumn<TProperty>({
    Header: 'Value',
    accessor: 'market_value',
});

const CostCol = createNumericColumn<TProperty>(
    {
        Header: 'Cost',
        accessor: 'cost',
    },
    {
        colorize: false,
    },
);

const ChangeCol = createNumericColumn<TProperty>({
    Header: 'Change $',
    id: 'change',
    accessor: (p) => {
        return new Decimal(p.market_value).minus(p.cost).toNumber();
    },
});

const ChangePercCol = createNumericColumn<TProperty>(
    {
        Header: 'Change %',
        id: 'changePerc',
        accessor: (p) => {
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
