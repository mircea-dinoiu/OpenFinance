import {Paper} from '@material-ui/core';
import {TextFieldCell} from 'components/cells';
import {TableWithInlineEditing} from 'components/tables/TableWithInlineEditing';
import {routes} from 'defs/routes';
import {spacingMedium} from 'defs/styles';
import React from 'react';
import {useCategoriesReader} from 'state/categories';
import {useCategories} from 'state/hooks';
import {Category} from 'types';

export const Categories = () => {
    const rows = useCategories();
    const refresh = useCategoriesReader();

    return (
        <Paper style={{padding: spacingMedium}}>
            <TableWithInlineEditing<Category>
                data={rows}
                api={routes.categories}
                editableFields={['name', 'color']}
                onRefresh={refresh}
                defaultSorted={[{id: 'name', desc: false}]}
                allowDelete={true}
                columns={[
                    {
                        Header: 'Name',
                        accessor: 'name',
                        Cell: TextFieldCell,
                    },
                    {
                        accessor: 'color',
                        Header: 'Color',
                        Cell: TextFieldCell,
                    },
                    {accessor: 'expenses', Header: 'Transaction Count'},
                ]}
            />
        </Paper>
    );
};
