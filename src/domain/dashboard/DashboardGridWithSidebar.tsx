import {makeStyles} from '@material-ui/core/styles';
import React, {ReactNode} from 'react';

export const DashboardGridWithSidebar = ({sidebar, children}: {sidebar: ReactNode; children: ReactNode}) => {
    const cls = useStyles();

    return (
        <div className={cls.root}>
            <div className={cls.sidebar}>{sidebar}</div>
            <div>{children}</div>
        </div>
    );
};

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gridGap: theme.spacing(2),
        [theme.breakpoints.down('sm')]: {
            gridTemplateColumns: '1fr',
        },
    },
    sidebar: {
        '& > *:not(:last-child)': {
            marginBottom: theme.spacing(2),
        },
    },
}));
