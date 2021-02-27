import {makeStyles} from '@material-ui/core/styles';
import {ScreenQuery, spacingNormal} from 'defs/styles';
import React, {ReactNode} from 'react';

export const DashboardGridWithSidebar = ({sidebar, children}: {sidebar: ReactNode; children: ReactNode}) => {
    const cls = useStyles();

    return (
        <div className={cls.root}>
            <div>{sidebar}</div>
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
});
