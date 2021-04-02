import {Dialog, DialogContent} from '@material-ui/core';
import {TextFieldCell} from 'components/cells';
import {TableWithInlineEditing} from 'components/tables/TableWithInlineEditing';
import {Api} from 'defs/Api';
import {Category} from 'domain/categories/defs';
import React from 'react';
import {useCategories, useCategoriesReader} from 'domain/categories/state';

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
