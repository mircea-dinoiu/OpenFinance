// @flow
import React from 'react';
import {TableHeaderColumn, TableRow} from 'material-ui';
import {ColumnStyles} from './defs';

const IncomeHeader = () => (
    <TableRow>
        <TableHeaderColumn style={ColumnStyles.CURRENCY}>
            Currency
        </TableHeaderColumn>
        <TableHeaderColumn style={ColumnStyles.AMOUNT}>
            Amount
        </TableHeaderColumn>
        <TableHeaderColumn>Description</TableHeaderColumn>
        <TableHeaderColumn style={ColumnStyles.DATE_TIME}>
            Date & Time
        </TableHeaderColumn>
        <TableHeaderColumn style={ColumnStyles.DESTINATION}>
            Destination
        </TableHeaderColumn>
        <TableHeaderColumn style={ColumnStyles.PERSON}>
            Person
        </TableHeaderColumn>
        <TableHeaderColumn style={ColumnStyles.REPEAT}>
            Repeat
        </TableHeaderColumn>
    </TableRow>
);

export default IncomeHeader;
