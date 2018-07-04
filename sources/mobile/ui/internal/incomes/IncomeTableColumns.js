// @flow
import React from 'react';
import CurrencyISOCodeDisplay from 'common/components/FinancialTable/cells/CurrencyISOCodeDisplay';
import AmountDisplay from 'common/components/FinancialTable/cells/AmountDisplay';
import DescriptionDisplay from 'common/components/FinancialTable/cells/DescriptionDisplay';
import DestinationDisplay from 'mobile/ui/internal/incomes/cells/DestinationDisplay';
import FromDisplay from 'mobile/ui/internal/incomes/cells/FromDisplay';
import DateDisplay from 'common/components/FinancialTable/cells/DateDisplay';
import RepeatsDisplay from 'common/components/FinancialTable/cells/RepeatsDisplay';

const ColumnStyles = {
    CURRENCY: {textAlign: 'center'},
    AMOUNT: {textAlign: 'right'},
    DATE_TIME: {textAlign: 'center'},
    DESTINATION: {textAlign: 'center'},
    PERSON: {textAlign: 'center'},
    REPEAT: {textAlign: 'center'}
};

export default [
    {
        Header: 'Currency',
        accessor: (item) => <CurrencyISOCodeDisplay item={item} />,
        id: 'currency',
        //
        width: 80,
        headerStyle: ColumnStyles.CURRENCY,
        style: ColumnStyles.CURRENCY
    },
    {
        Header: 'Amount',
        accessor: (item) => <AmountDisplay item={item} />,
        id: 'amount',
        //
        width: 100,
        headerStyle: ColumnStyles.AMOUNT,
        style: ColumnStyles.AMOUNT
    },
    {
        Header: 'Description',
        accessor: (item) => <DescriptionDisplay entity="income" item={item} />,
        id: 'description'
    },
    {
        Header: 'Date & Time',
        accessor: (item) => <DateDisplay item={item} />,
        id: 'datetime',
        //
        className: 'msl__date-column',
        width: 200,
        headerStyle: ColumnStyles.DATE_TIME,
        style: ColumnStyles.DATE_TIME
    },
    {
        Header: 'Destination',
        accessor: (item) => <DestinationDisplay item={item} />,
        id: 'destination',
        //
        headerStyle: ColumnStyles.DESTINATION,
        style: ColumnStyles.DESTINATION
    },
    {
        Header: 'Person',
        accessor: (item) => <FromDisplay item={item} />,
        id: 'from',
        //
        width: 100,
        headerStyle: ColumnStyles.PERSON,
        style: ColumnStyles.PERSON,
    },
    {
        Header: 'Repeat',
        accessor: (item) => <RepeatsDisplay item={item} />,
        id: 'repeat',
        //
        headerStyle: ColumnStyles.REPEAT,
        style: ColumnStyles.REPEAT,
    }
];
