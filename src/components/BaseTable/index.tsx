import {grey} from '@material-ui/core/colors';
import {colors, gridGap, spacingLarge, spacingSmall, stickyHeaderHeight} from 'defs/styles';
import * as React from 'react';
import ReactTable, {TableProps} from 'react-table-6';
import 'react-table-6/react-table.css';
import styled from 'styled-components';

export const Classes = {
    todayRow: 'todayRow',
    pendingRow: 'pendingRow',
    selectedRow: 'selectedRow',
    hiddenRow: 'hiddenRow',
    notSelectable: 'notSelectable',
};

const ReactTableStyled = styled(ReactTable)`
    &.ReactTable.ReactTable {
        font-size: 1rem;
        border: 0 !important;

        .rt-tr:hover {
            background: ${colors.hover};
        }

        .rt-td,
        .rt-th {
            line-height: 20px;
            padding-bottom: 2px;
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

        .${Classes.pendingRow} {
            background: rgba(255, 255, 255, 0.075);
        }

        .${Classes.todayRow} {
            font-weight: 500;
        }

        .${Classes.selectedRow}, .${Classes.selectedRow}:hover {
            background: rgb(244, 228, 179, 0.25);
        }

        .${Classes.hiddenRow} {
            opacity: 0.5;
        }

        .${Classes.notSelectable} {
            user-select: none;
        }
    }
`;

export const TableHeader = styled.div`
    padding: 0 ${spacingLarge} ${spacingSmall};
    font-size: 1rem;
    border-bottom: 1px solid ${grey[700]};
    position: sticky;
    top: ${stickyHeaderHeight};
    z-index: 1;
    background: ${grey[800]};
    border-radius: 4px;
`;

export const TableHeaderTop = styled.div`
    display: grid;
    grid-gap: ${gridGap};
    grid-template-columns: repeat(${(props: {columnCount: number}) => props.columnCount}, max-content);
    align-items: center;
`;

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
