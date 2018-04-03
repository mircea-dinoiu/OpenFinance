// @flow
import React from 'react';
import {TableHeaderColumn, TableRow} from 'material-ui';
import {ColumnStyles} from './defs';

const ExpenseHeaderRow = () => {
    return (
        <TableRow>
            <TableHeaderColumn style={ColumnStyles.CURRENCY}>
                Currency
            </TableHeaderColumn>
            <TableHeaderColumn style={ColumnStyles.AMOUNT}>
                Amount
            </TableHeaderColumn>
            <TableHeaderColumn>
                Description
            </TableHeaderColumn>
            <TableHeaderColumn style={ColumnStyles.DATE_TIME}>
                Date & Time
            </TableHeaderColumn>
            <TableHeaderColumn>
                Categories
            </TableHeaderColumn>
            <TableHeaderColumn style={ColumnStyles.ACCOUNT}>
                Account
            </TableHeaderColumn>
            <TableHeaderColumn style={ColumnStyles.PERSONS}>
                Person(s)
            </TableHeaderColumn>
            <TableHeaderColumn style={ColumnStyles.REPEAT}>
                Repeat
            </TableHeaderColumn>
        </TableRow>
    );
};

export default ExpenseHeaderRow;