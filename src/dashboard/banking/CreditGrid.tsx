import {NameColX} from '../columns';
import {
    CreditAvailableCol,
    CreditLimitCol,
    CreditUsageCol,
    CreditAprCol,
    CreditBalanceCol,
    BalanceProgress,
    mapCashAccountToBalance,
} from '../Credit';
import React from 'react';
import {CashAccount} from '../defs';
import {XGrid} from '@material-ui/x-grid';
import {useGridFooter} from '../makeTotalFooter';

export const CreditGrid = ({rows, className}: {rows: CashAccount[]; className?: string}) => {
    const Footer = useGridFooter({
        rows,
        columns: [
            CreditBalanceCol,
            CreditAvailableCol,
            CreditLimitCol,
            {
                ...CreditUsageCol,
                renderFooter: () => {
                    const data = rows;
                    const totalBalance = data.reduce((acc, d) => acc + mapCashAccountToBalance(d), 0);
                    const totalLimit = data.reduce((acc, d) => acc + (d.credit_limit ?? 0), 0);
                    const progress = Math.round((totalBalance / totalLimit) * 100);

                    return progress !== Infinity && `${CreditUsageCol.headerName}: ${progress}%`;
                },
            },
        ],
    });

    return (
        <XGrid
            className={className}
            autoHeight={true}
            sortModel={[{field: 'balance', sort: 'desc'}]}
            columns={[NameColX, CreditBalanceCol, CreditAvailableCol, CreditLimitCol, CreditUsageCol, CreditAprCol]}
            rows={rows}
            components={{Footer}}
        />
    );
};
