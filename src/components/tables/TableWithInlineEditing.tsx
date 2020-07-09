import {makeStyles} from '@material-ui/core/styles';
import IconCancel from '@material-ui/icons/Cancel';
import IconEdit from '@material-ui/icons/Edit';
import IconSave from '@material-ui/icons/Save';
import IconDelete from '@material-ui/icons/Delete';
import {BaseTable} from 'components/BaseTable';
import {spacingSmall} from 'defs/styles';
import React, {useState} from 'react';
import {Column, TableProps} from 'react-table-6';
import {createXHR} from 'utils/fetch';
import {pick} from 'lodash';

export const TableWithInlineEditing = <D extends {id: number}>({
    columns,
    allowDelete = true,
    editableFields = [],
    onRefresh,
    api,
    ...props
}: Omit<Partial<TableProps<D>>, 'columns' | 'loading'> & {
    columns: (editor: D | null, setEditor: (e: D) => void) => Column<D>[];
    allowDelete?: boolean;
    api: string;
    editableFields?: string[];
    onRefresh: () => Promise<unknown>;
}) => {
    const [editor, setEditor] = useState<D | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const cls = useStyles();

    return (
        <BaseTable
            {...props}
            loading={isSaving}
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
                                            setIsSaving(true);
                                            const r = await createXHR({
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

                                            console.log(r);

                                            await onRefresh();

                                            setIsSaving(false);
                                            setEditor(null);
                                        }}
                                    />
                                </>
                            ) : (
                                <>
                                    {allowDelete && (
                                        <IconDelete className={cls.icon} />
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
    );
};

const useStyles = makeStyles({
    actions: {
        display: 'grid',
        gridGap: spacingSmall,
        gridTemplateColumns: '1fr 1fr',
    },
    icon: {
        cursor: 'pointer',
    },
});
