import {styled, Theme} from '@material-ui/core/styles';
import React, {ReactNode} from 'react';

export const DashboardGridWithSidebar = ({sidebar, children}: {sidebar: ReactNode; children: ReactNode}) => {
    const sidebars = Array.isArray(sidebar) ? sidebar.filter(Boolean) : [sidebar].filter(Boolean);

    return (
        <Root sidebarCount={sidebars.length}>
            {sidebars.map((sidebar) => (
                <Sidebar>{sidebar}</Sidebar>
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
        display: 'flex',
        flexDirection: 'column',
    },
}));

const Sidebar = styled('div')(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    '& > *:not(:last-child)': {
        marginBottom: theme.spacing(2),
    },
}));
