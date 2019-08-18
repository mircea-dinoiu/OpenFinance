// @flow
import * as React from 'react';
import ReactTable from 'react-table';
import styled, {css, createGlobalStyle} from 'styled-components';
import cssReactTable from 'react-table/react-table.css';

export const Classes = {
    todayRow: 'todayRow',
    pendingRow: 'pendingRow',
    selectedRow: 'selectedRow',
    hiddenRow: 'hiddenRow',
    notSelectable: 'notSelectable',
};

const reactTableHideHead = css`
    .rt-thead {
        display: none;
    }
`;

const GlobalStyle = createGlobalStyle`${cssReactTable}`;

const ReactTableStyled = styled(ReactTable)`
    background: #fff;
    font-size: 14px;
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

    ${(props) => props.hideHeader && reactTableHideHead}
`;

export const TableHeader = styled.div`
    background: white;
    padding: 5px 20px;
    font-size: 14px;
    border-bottom: 1px solid rgb(244, 244, 244);
    width: 100%;
`;

export const TableFooter = styled.div`
    background: white;
    padding: 5px 20px;
    font-size: 14px;
    border-top: 1px solid rgb(244, 244, 244);
    box-shadow: 0 -2px 15px 0 rgba(0, 0, 0, 0.15);
    position: absolute;
    width: 100%;
`;

export default function BaseTable(props) {
    return (
        <>
            <GlobalStyle />
            <ReactTableStyled
                showPagination={false}
                pageSize={props.data.length}
                {...props}
            />
        </>
    );
}
