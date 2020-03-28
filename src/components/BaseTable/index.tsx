import * as React from 'react';
import ReactTable from 'react-table-6';
import styled, {css} from 'styled-components';
import 'react-table-6/react-table.css';
import {green, red} from '@material-ui/core/colors';
import {spacingLarge, spacingSmall, gridGap} from 'defs/styles';

export const Classes = {
    todayRow: 'todayRow',
    pendingRow: 'pendingRow',
    selectedRow: 'selectedRow',
    hiddenRow: 'hiddenRow',
    notSelectable: 'notSelectable',
    depositRow: 'depositRow',
    withdrawRow: 'withdrawRow',
};

const reactTableHideHead = css`
    .rt-thead {
        display: none;
    }
`;

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

        .${Classes.withdrawRow} .rt-td:nth-child(1),
        .${Classes.withdrawRow} .rt-td:nth-child(2) {
            color: ${red[900]};
        }

        .${Classes.depositRow} .rt-td:nth-child(1),
        .${Classes.depositRow} .rt-td:nth-child(2) {
            background: ${green[50]};
            color: ${green[900]};
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

        ${(props: {hideHeader?: boolean}) =>
            props.hideHeader && reactTableHideHead}
    }
`;

export const TableHeader = styled.div`
    padding: 0 ${spacingLarge};
    font-size: 1rem;
    border-bottom: 1px solid rgb(244, 244, 244);
    display: grid;
    grid-gap: ${gridGap};
    grid-template-columns: repeat(
        ${(props: {columnCount: number}) => props.columnCount},
        max-content
    );
`;

export const TableFooter = styled.div`
    padding: ${spacingSmall} ${spacingLarge};
    font-size: 1rem;
    border-top: 1px solid rgb(244, 244, 244);
    box-shadow: 0 -2px 15px 0 rgba(0, 0, 0, 0.15);
`;

export function BaseTable(props) {
    return (
        <>
            <ReactTableStyled
                showPagination={false}
                pageSize={props.data.length}
                {...props}
            />
        </>
    );
}
