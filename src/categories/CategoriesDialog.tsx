import {Dialog, DialogContent} from '@material-ui/core';
import {TextFieldCell} from 'app/cells';
import {TableWithInlineEditing} from 'app/TableWithInlineEditing';
import {Api} from 'app/Api';
import {Category} from 'categories/defs';
import React from 'react';
import {useCategories, useCategoriesReader} from 'categories/state';

export const CategoriesDialog = ({isOpen, onClose}: {isOpen: boolean; onClose: () => void}) => {
    const rows = useCategories();
    const refresh = useCategoriesReader();

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth={true}>
            <DialogContent>
                <TableWithInlineEditing<Category>
                    data={rows}
                    api={Api.categories}
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
