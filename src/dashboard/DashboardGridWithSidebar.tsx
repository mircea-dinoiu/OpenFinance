import {makeStyles, styled, Theme} from '@material-ui/core/styles';
import React, {ReactNode} from 'react';

export const DashboardGridWithSidebar = ({sidebar, children}: {sidebar: ReactNode; children: ReactNode}) => {
    const cls = useStyles();
    const sidebars = Array.isArray(sidebar) ? sidebar.filter(Boolean) : [sidebar].filter(Boolean);

    return (
        <Root sidebarCount={sidebars.length}>
            {sidebars.map((sidebar) => (
                <div className={cls.sidebar}>{sidebar}</div>
            ))}
            <div>{children}</div>
        </Root>
    );
};

const Root = styled('div')(({theme, sidebarCount}: {sidebarCount: number; theme: Theme}) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${sidebarCount}, auto) 1fr`,
    gridGap: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: '1fr',
    },
}));

const useStyles = makeStyles((theme) => ({
    sidebar: {
        '& > *:not(:last-child)': {
            marginBottom: theme.spacing(2),
        },
    },
}));
