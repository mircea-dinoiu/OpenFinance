import {Paper} from '@material-ui/core';
import {BaseTable} from 'components/BaseTable';
import {spacingMedium} from 'defs/styles';
import React from 'react';
import {useCategories} from 'state/hooks';

export const Categories = () => {
    const rows = useCategories();

    return (
        <Paper style={{padding: spacingMedium}}>
            <BaseTable
                data={rows}
                columns={[
                    {accessor: 'id', Header: 'ID'},
                    {accessor: 'name', Header: 'Name'},
                    {accessor: 'color', Header: 'Color'},
                    {accessor: 'expenses', Header: 'Transaction Count'},
                ]}
            />
        </Paper>
    );
};
