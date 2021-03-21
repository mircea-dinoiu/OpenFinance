import {makeStyles} from '@material-ui/core/styles';
import {ScreenQuery, spacingNormal, theme} from 'defs/styles';
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

const useStyles = makeStyles({
    root: {
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gridGap: spacingNormal,
        [ScreenQuery.SMALL]: {
            gridTemplateColumns: '1fr',
        },
    },
    sidebar: {
        '& > *:not(:last-child)': {
            marginBottom: theme.spacing(1),
        },
    },
});
