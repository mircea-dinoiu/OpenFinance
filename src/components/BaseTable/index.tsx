import {styled, Theme} from '@material-ui/core';
import {colors, stickyHeaderHeight} from 'defs/styles';
import * as React from 'react';
import ReactTable, {TableProps} from 'react-table-6';
import 'react-table-6/react-table.css';
import styledComponent from 'styled-components';

export const Classes = {
    pastRow: 'pastRow',
    selectedRow: 'selectedRow',
    hiddenRow: 'hiddenRow',
    notSelectable: 'notSelectable',
};

const ReactTableStyled = styledComponent(ReactTable)`
    &.ReactTable.ReactTable {
        font-size: 1rem;
        border: 0 !important;

        .rt-tr {
            transition: all 0.25s ease;
        }

        .rt-tr:hover {
            background: ${colors.hover};
        }

        .rt-td,
        .rt-th {
            line-height: 20px;
            padding: 5px;
            border-right-color: ${colors.borderSecondary};
        }

        .rt-tr-group {
            border-bottom-color: ${colors.borderSecondary};
        }

        .rt-thead.-filters {
            border-bottom-color: ${colors.borderSecondary};
        }

        .rt-thead.-header {
            box-shadow: none;
            font-weight: 500;
            border-bottom: 1px solid ${colors.borderPrimary};
        }
        .rt-tfoot {
            box-shadow: none;
            border-top: 1px solid ${colors.borderPrimary};
            background-color: ${colors.tableFoot};
        }

        .rt-thead.-filters input {
            background: transparent;
            border-color: ${colors.borderPrimary};
            color: inherit;
        }

        .${Classes.pastRow} {
            background: ${colors.pastRow};
        }

        .${Classes.selectedRow}, .${Classes.selectedRow}:hover {
            background: ${colors.tableHighlight};
            font-weight: 500;
        }

        .${Classes.hiddenRow} {
            opacity: 0.5;
        }

        .${Classes.notSelectable} {
            user-select: none;
        }
    }
`;

export const TableHeader = styled('div')((props) => ({
    padding: `0 ${props.theme.spacing(3)} ${props.theme.spacing(1)}`,
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
