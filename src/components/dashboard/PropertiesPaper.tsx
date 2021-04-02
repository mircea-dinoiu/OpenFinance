import {useProperties, Property} from 'state/properties';
import React from 'react';
import {CardHeader, Paper, CardContent, Card} from '@material-ui/core';
import HouseIcon from '@material-ui/icons/House';
import {BaseTable} from 'components/BaseTable';
import {Column} from 'react-table-6';
import {NumericValue} from 'components/formatters';
import {financialNum} from 'js/utils/numbers';
import Decimal from 'decimal.js';
import {locales} from 'locales';
import {BigLoader} from 'components/loaders';
import {firstColumnStyles, numericColumnStyles} from 'styles/column';

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

const NameCol: Column<Property> = {
    Header: 'Name',
    accessor: 'name',
    ...firstColumnStyles,
};

const ValueCol: Column<Property> = {
    Header: 'Value',
    accessor: 'market_value',
    Cell: ({value, original}) => {
        return <NumericValue currency={original.currency_id} value={value} colorize={true} />;
    },
    ...numericColumnStyles,
};

const CostCol: Column<Property> = {
    Header: 'Cost',
    accessor: 'cost',
    Cell: ({value, original}) => {
        return <NumericValue currency={original.currency_id} value={value} colorize={false} />;
    },
    ...numericColumnStyles,
};

const ChangeCol: Column<Property> = {
    Header: 'Change $',
    id: 'change',
    accessor: (p) => {
        return new Decimal(p.market_value).minus(p.cost).toNumber();
    },
    Cell: ({value, original}) => {
        return <NumericValue colorize={true} currency={original.currency_id} value={value} />;
    },
    ...numericColumnStyles,
};

const ChangePercCol: Column<Property> = {
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
    Cell: ({value}) => <NumericValue colorize={true} value={value} after="%" />,
    ...numericColumnStyles,
};
