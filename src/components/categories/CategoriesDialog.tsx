import {Dialog, DialogContent} from '@material-ui/core';
import {TextFieldCell} from 'components/cells';
import {TableWithInlineEditing} from 'components/tables/TableWithInlineEditing';
import {routes} from 'defs/routes';
import React from 'react';
import {useCategoriesReader} from 'state/categories';
import {useCategories} from 'state/hooks';
import {Category} from 'types';

export const CategoriesDialog = ({isOpen, onClose}: {isOpen: boolean; onClose: () => void}) => {
    const rows = useCategories();
    const refresh = useCategoriesReader();

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth={true}>
            <DialogContent>
                <TableWithInlineEditing<Category>
                    data={rows}
                    api={routes.categories}
                    editableFields={['name']}
                    onRefresh={refresh}
                    defaultSorted={[{id: 'name', desc: false}]}
                    allowDelete={true}
                    columns={[
                        {
                            Header: 'Name',
                            accessor: 'name',
                            Cell: TextFieldCell,
                        },
                        {accessor: 'expenses', Header: 'Transaction Count'},
                    ]}
                />
            </DialogContent>
        </Dialog>
    );
};