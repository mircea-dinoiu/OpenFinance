// @flow
import React from 'react';
import DescriptionDisplay from 'common/components/FinancialTable/cells/DescriptionDisplay';
import FromDisplay from 'mobile/ui/internal/incomes/cells/FromDisplay';
import CurrencyColumn from 'common/components/FinancialTable/columns/CurrencyColumn';
import AmountColumn from 'common/components/FinancialTable/columns/AmountColumn';
import DateTimeColumn from 'common/components/FinancialTable/columns/DateTimeColumn';
import AccountColumn from 'common/components/FinancialTable/columns/AccountColumn';
import RepeatColumn from 'common/components/FinancialTable/columns/RepeatColumn';

export default [
    CurrencyColumn,
    AmountColumn,
    {
        Header: 'Description',
        accessor: (item) => <DescriptionDisplay entity="income" item={item} />,
        id: 'description'
    },
    DateTimeColumn,
    AccountColumn,
    {
        Header: 'Person',
        accessor: (item) => <FromDisplay item={item} />,
        id: 'from',
        //
        width: 100,
        headerStyle: {textAlign: 'center'},
        style: {textAlign: 'center'},
    },
    RepeatColumn,
];
