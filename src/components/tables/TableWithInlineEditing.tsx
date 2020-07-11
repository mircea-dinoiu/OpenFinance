import {Button} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import IconCancel from '@material-ui/icons/Cancel';
import IconDelete from '@material-ui/icons/Delete';
import IconEdit from '@material-ui/icons/Edit';
import IconSave from '@material-ui/icons/Save';
import {BaseTable} from 'components/BaseTable';
import {FloatingSnackbar} from 'components/snackbars';
import {spacingSmall} from 'defs/styles';
import {pick} from 'lodash';
import React, {useState} from 'react';
import {Column, TableProps} from 'react-table-6';
import {createXHR} from 'utils/fetch';

export const TableWithInlineEditing = <D extends {id: number}>({
    columns,
    allowDelete,
    editableFields = [],
    onRefresh,
    api,
    ...props
}: Omit<Partial<TableProps<D>>, 'columns' | 'loading'> & {
    columns: (editor: D | null, setEditor: (e: D) => void) => Column<D>[];
    allowDelete: boolean;
    api: string;
    editableFields?: string[];
    onRefresh: () => Promise<unknown>;
}) => {
    const [editor, setEditor] = useState<D | null>(null);
    const [loading, setLoading] = useState(false);
    const cls = useStyles();
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const deleteSelected = async () => {
        setDeletingId(null);
        setLoading(true);

        await createXHR({
            url: api,
            method: 'DELETE',
            data: {
                data: [{id: deletingId}],
            },
        });

        await onRefresh();
        setLoading(false);
    };

    return (
        <>
            <BaseTable
                {...props}
                loading={loading}
                getTrProps={(state, item) => ({
                    onDoubleClick: () => setEditor(item.original),
                })}
                columns={[
                    {
                        accessor: 'id',
                        Header: 'ID',
                        width: 60,
                        style: {textAlign: 'center'},
                    },
                    {
                        id: 'actions',
                        Header: 'Actions',
                        width: 60,
                        accessor: (row) => (
                            <div className={cls.actions}>
                                {row.id === editor?.id ? (
                                    <>
                                        <IconCancel
                                            className={cls.icon}
                                            onClick={() => setEditor(null)}
                                        />
                                        <IconSave
                                            className={cls.icon}
                                            onClick={async () => {
                                                setLoading(true);

                                                await createXHR({
                                                    url: api,
                                                    method: 'PUT',
                                                    data: {
                                                        data: [
                                                            pick(
                                                                editor,
                                                                'id',
                                                                ...editableFields,
                                                            ),
                                                        ],
                                                    },
                                                });

                                                await onRefresh();

                                                setLoading(false);
                                                setEditor(null);
                                            }}
                                        />
                                    </>
                                ) : (
                                    <>
                                        {allowDelete && (
                                            <IconDelete
                                                className={cls.icon}
                                                onClick={() =>
                                                    setDeletingId(row.id)
                                                }
                                            />
                                        )}
                                        <IconEdit
                                            className={cls.icon}
                                            onClick={() => setEditor(row)}
                                        />
                                    </>
                                )}
                            </div>
                        ),
                    },
                    ...columns(editor, setEditor),
                ]}
            />
            {deletingId && (
                <FloatingSnackbar
                    severity="info"
                    message={
                        <div className={cls.confirmation}>
                            <div>
                                Do you want to delete entry #{deletingId}?
                            </div>
                            <Button
                                className={cls.confirmationBtn}
                                onClick={deleteSelected}
                            >
                                Yes
                            </Button>
                            <Button
                                className={cls.confirmationBtn}
                                onClick={() => setDeletingId(null)}
                            >
                                No
                            </Button>
                        </div>
                    }
                />
            )}
        </>
    );
};

const useStyles = makeStyles({
    actions: {
        display: 'grid',
        gridGap: spacingSmall,
        gridTemplateColumns: '1fr 1fr',
    },
    confirmation: {
        display: 'grid',
        gridGap: spacingSmall,
        gridTemplateColumns: '1fr auto auto',
        alignItems: 'center',
    },
    confirmationBtn: {
        padding: 0,
    },
    icon: {
        cursor: 'pointer',
    },
});