import * as React from 'react';
import ReactTable from 'react-table';
import styled, {css} from 'styled-components';
import 'react-table/react-table.css';
import {green, red} from '@material-ui/core/colors';

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
    background: #fff;
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

    ${(props) => props.hideHeader && reactTableHideHead}
`;

export const TableHeader = styled.div`
    background: white;
    padding: 0 20px;
    font-size: 1rem;
    border-bottom: 1px solid rgb(244, 244, 244);
    width: 100%;
    display: grid;
    grid-gap: 10px;
    grid-template-columns: repeat(4, max-content);
`;

export const TableFooter = styled.div`
    background: white;
    padding: 5px 20px;
    font-size: 1rem;
    border-top: 1px solid rgb(244, 244, 244);
    box-shadow: 0 -2px 15px 0 rgba(0, 0, 0, 0.15);
    position: absolute;
    width: 100%;
`;

export default function BaseTable(props) {
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
