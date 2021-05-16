import {Dialog, DialogContent} from '@material-ui/core';
import {Api} from 'app/Api';
import {TCategory} from 'categories/defs';
import React from 'react';
import {useCategories, useCategoriesReader} from 'categories/state';
import {EditableDataGrid} from 'app/EditableDataGrid';
import {DialogTitleWithClose} from 'app/DialogTitleWithClose';

export const CategoriesDialog = ({isOpen, onClose}: {isOpen: boolean; onClose: () => void}) => {
    const rows = useCategories();
    const refresh = useCategoriesReader();

    return (
        <Dialog open={isOpen} onClose={onClose} fullScreen={true}>
            <DialogTitleWithClose title="Manage Categories" onClose={onClose} />
            <DialogContent>
                <EditableDataGrid<TCategory>
                    rows={rows}
                    api={Api.categories}
                    onRefresh={refresh}
                    sortModel={[{field: 'name', sort: 'asc'}]}
                    allowDelete={true}
                    columns={[
                        {
                            headerName: 'Name',
                            field: 'name',
                            editable: true,
                            flex: 2,
                        },
                        {field: 'expenses', headerName: 'Transaction Count', flex: 1},
                    ]}
                />
            </DialogContent>
        </Dialog>
    );
};
