import {Button} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import IconDelete from '@material-ui/icons/Delete';
import {FloatingSnackbar} from 'app/snackbars';
import React, {useState} from 'react';
import {useSelectedProject} from 'projects/state';
import {createXHR} from 'app/fetch';
import {makeUrl} from 'app/url';
import {XGridProps, XGrid} from '@material-ui/x-grid';

export const EditableDataGrid = <D extends {id: number}>({
    allowDelete,
    onRefresh,
    api,
    ...props
}: {
    allowDelete: boolean;
    api: string;
    onRefresh: () => Promise<unknown>;
} & XGridProps) => {
    const [loading, setLoading] = useState(false);
    const cls = useStyles();
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const project = useSelectedProject();

    const deleteSelected = async () => {
        setDeletingId(null);
        setLoading(true);

        try {
            await createXHR({
                url: makeUrl(api, {projectId: project.id}),
                method: 'DELETE',
                data: {
                    ids: [deletingId],
                },
            });
        } catch (e) {
            // noop
        }

        await onRefresh();
        setLoading(false);
    };

    return (
        <>
            <XGrid
                {...props}
                loading={loading}
                onEditCellChangeCommitted={async (params) => {
                    const {field, id} = params;
                    const {value} = params.props;
                    const prevValue = props.rows.find((d) => d.id === id)?.[field];

                    if (prevValue === value) {
                        return;
                    }

                    setLoading(true);

                    await createXHR({
                        url: makeUrl(api, {
                            projectId: project.id,
                        }),
                        method: 'PUT',
                        data: {
                            data: [
                                {
                                    id: params.id,
                                    [params.field]: params.props.value,
                                },
                            ],
                        },
                    });

                    await onRefresh();

                    setLoading(false);
                }}
                columns={[
                    {
                        field: 'id',
                        headerName: 'ID',
                        width: 100,
                        align: 'right',
                        headerAlign: 'right',
                    },
                    ...props.columns,
                    {
                        field: 'actions',
                        headerName: 'Actions',
                        width: 100,
                        renderCell: (params) => (
                            <div className={cls.actions}>
                                {allowDelete && (
                                    <IconDelete
                                        className={cls.icon}
                                        onClick={() => setDeletingId(params.id as number)}
                                    />
                                )}
                            </div>
                        ),
                        headerAlign: 'center',
                    },
                ]}
            />
            {deletingId && (
                <FloatingSnackbar
                    severity="info"
                    message={
                        <div className={cls.confirmation}>
                            <div>Do you want to delete entry #{deletingId}?</div>
                            <Button className={cls.confirmationBtn} onClick={deleteSelected}>
                                Yes
                            </Button>
                            <Button className={cls.confirmationBtn} onClick={() => setDeletingId(null)}>
                                No
                            </Button>
                        </div>
                    }
                />
            )}
        </>
    );
};

const useStyles = makeStyles((theme) => ({
    actions: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    confirmation: {
        display: 'grid',
        gridGap: theme.spacing(1),
        gridTemplateColumns: '1fr auto auto',
        alignItems: 'center',
    },
    confirmationBtn: {
        padding: 0,
    },
    icon: {
        cursor: 'pointer',
    },
}));
