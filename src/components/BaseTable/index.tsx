import {styled, Theme} from '@material-ui/core';
import {colors, stickyHeaderHeight} from 'defs/styles';
import * as React from 'react';
import ReactTable, {TableProps} from 'react-table-6';
import 'react-table-6/react-table.css';

export const Classes = {
    pastRow: 'pastRow',
    selectedRow: 'selectedRow',
    hiddenRow: 'hiddenRow',
    notSelectable: 'notSelectable',
};

const ReactTableStyled = styled(ReactTable)((props) => ({
    '&.ReactTable.ReactTable': {
        fontSize: '1rem',
        border: '0 !important',

        '& .rt-tr': {
            transition: 'all 0.25s ease',
        },

        '& .rt-tr:hover': {
            background: colors.hover,
        },

        '& .rt-td, & .rt-th': {
            lineHeight: '20px',
            padding: props.theme.spacing(1),
            borderRightColor: colors.borderSecondary,
        },

        '& .rt-tr-group': {
            borderBottomColor: colors.borderSecondary,
        },

        '& .rt-thead.-filters': {
            borderBottomColor: colors.borderSecondary,
        },

        '& .rt-thead.-header': {
            boxShadow: 'none',
            fontWeight: props.theme.typography.fontWeightMedium,
            borderBottom: `1px solid ${colors.borderPrimary}`,
        },

        '& .rt-tfoot': {
            boxShadow: 'none',
            borderTop: `1px solid ${colors.borderPrimary}`,
            backgroundColor: colors.tableFoot,
        },

        '& .rt-thead.-filters input': {
            background: 'transparent',
            borderColor: colors.borderPrimary,
            color: 'inherit',
        },

        [`& .${Classes.pastRow}`]: {
            background: colors.pastRow,
        },

        [`& .${Classes.selectedRow}, & .${Classes.selectedRow}:hover`]: {
            background: colors.tableHighlight,
            fontWeight: props.theme.typography.fontWeightMedium,
        },

        [`& .${Classes.hiddenRow}`]: {
            opacity: 0.5,
        },

        [`& .${Classes.notSelectable}`]: {
            userSelect: 'none',
        },
    },
}));

export const TableHeader = styled('div')((props) => ({
    padding: props.theme.spacing(0, 1, 1),
    fontSize: '1rem',
    borderBottom: `1px solid ${colors.tableHeaderBorder}`,
    position: 'sticky',
    top: stickyHeaderHeight,
    zIndex: 1,
    background: colors.tableHeaderBg,
    borderRadius: '4px',
}));

export const TableHeaderTop = styled('div')((props: {columnCount: number; theme: Theme}) => ({
    display: 'grid',
    gridGap: props.theme.spacing(2),
    gridTemplateColumns: `repeat(${props.columnCount}, max-content)`,
    alignItems: 'center',
}));

export function BaseTable<D>(props: Partial<TableProps<D>>) {
    return (
        // @ts-ignore
        <ReactTableStyled
            showPagination={false}
            pageSize={props.data?.length}
            pageSizeOptions={[50, 100, 200, 400, 800]}
            {...props}
        />
    );
}
