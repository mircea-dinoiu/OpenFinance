import {
    gridGap,
    spacingLarge,
    spacingSmall,
    stickyHeaderHeight,
} from 'defs/styles';
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
    &.ReactTable {
        font-size: 1rem;
        border: 0 !important;

        .rt-tr:hover {
            background: rgb(234, 239, 244);
        }

        .rt-td {
            line-height: 20px;
            padding-bottom: 2px;
        }

        .${Classes.pendingRow} {
            background: rgba(0, 0, 0, 0.075);
        }

        .${Classes.todayRow} {
            font-weight: 500;
        }

        .${Classes.selectedRow}, .${Classes.selectedRow}:hover {
            background: rgb(244, 228, 179);
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
    border-bottom: 1px solid rgb(244, 244, 244);
    position: sticky;
    top: ${stickyHeaderHeight};
    z-index: 1;
    background: white;
    border-radius: 4px;
`;

export const TableHeaderTop = styled.div`
    display: grid;
    grid-gap: ${gridGap};
    grid-template-columns: repeat(
        ${(props: {columnCount: number}) => props.columnCount},
        max-content
    );
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
