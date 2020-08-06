import {Paper, TextField} from '@material-ui/core';
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
                columns={(editor, setEditor) => [
                    {
                        Header: 'Name',
                        accessor: 'name',
                        Cell: ({original: row}) =>
                            editor && editor.id === row.id ? (
                                <TextField
                                    value={editor.name}
                                    onChange={(e) =>
                                        setEditor({
                                            ...editor,
                                            name: e.target.value,
                                        })
                                    }
                                    fullWidth={true}
                                />
                            ) : (
                                row.name
                            ),
                    },
                    {
                        accessor: 'color',
                        Header: 'Color',
                        Cell: ({original: row}) =>
                            editor && editor.id === row.id ? (
                                <TextField
                                    value={editor.color}
                                    onChange={(e) =>
                                        setEditor({
                                            ...editor,
                                            color: e.target.value,
                                        })
                                    }
                                    fullWidth={true}
                                />
                            ) : (
                                row.color
                            ),
                    },
                    {accessor: 'expenses', Header: 'Transaction Count'},
                ]}
            />
        </Paper>
    );
};
