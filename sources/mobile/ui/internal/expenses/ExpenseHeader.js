// @flow
import React from 'react';
import {TableHeaderColumn, TableRow} from 'material-ui';

const ExpenseHeaderRow = () => {
    return (
        <TableRow>
            <TableHeaderColumn style={{textAlign: 'center'}}>
                Currency
            </TableHeaderColumn>
            <TableHeaderColumn style={{textAlign: 'right'}}>
                Amount
            </TableHeaderColumn>
            <TableHeaderColumn>
                Description
            </TableHeaderColumn>
            <TableHeaderColumn style={{textAlign: 'center'}}>
                Date & Time
            </TableHeaderColumn>
            <TableHeaderColumn>
                Categories
            </TableHeaderColumn>
            <TableHeaderColumn style={{textAlign: 'center'}}>
                Account
            </TableHeaderColumn>
            <TableHeaderColumn style={{textAlign: 'center'}}>
                Person(s)
            </TableHeaderColumn>
            <TableHeaderColumn style={{textAlign: 'center'}}>
                Repeat
            </TableHeaderColumn>
        </TableRow>
    );
};

export default ExpenseHeaderRow;