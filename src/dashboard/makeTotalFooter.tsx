import {NumericValue} from 'app/formatters';
import React, {useMemo, ReactNode} from 'react';
import {CashAccount} from 'dashboard/defs';
import {styled} from '@material-ui/core/styles';
import {GridFooterContainer, GridColDef} from '@material-ui/x-grid';

export const makeTotalFooter = ({colorize}: {colorize?: boolean} = {}) => ({
    data,
    column,
}: {
    data: {_original: CashAccount}[];
    column: {id: string};
}) => {
    return data[0] ? (
        <NumericValue
            variant="tableCell"
            colorize={colorize}
            // eslint-disable-next-line no-underscore-dangle
            currency={Number(data[0]._original.currency_id)}
            before="Total: "
            value={data.reduce((acc, row) => acc + row[column.id], 0)}
        />
    ) : null;
};

const FooterContainer = styled(GridFooterContainer)((props) => ({
    justifyContent: 'center !important',
    alignItems: 'flex-end !important',
    padding: props.theme.spacing(1, 2),
    gridGap: props.theme.spacing(1),
    flexDirection: 'column',
    minHeight: 'auto !important',
}));

export const useGridFooter = ({rows, columns}: {rows: CashAccount[]; columns: FooterColumn[]}) => {
    const [first] = rows;

    return useMemo(() => {
        return () => {
            return (
                first && (
                    <FooterContainer>
                        {columns.map((c, index) => {
                            if (c.renderFooter) {
                                return c.renderFooter();
                            }

                            return (
                                <NumericValue
                                    key={index}
                                    variant="gridFooter"
                                    colorize={c.colorize}
                                    currency={Number(first.currency_id)}
                                    before={`${c.headerName}: `}
                                    value={rows.reduce((acc, row) => {
                                        const value = c.valueGetter
                                            ? // @ts-ignore
                                              c.valueGetter({
                                                  row,
                                              })
                                            : row[c.field];

                                        return acc + value;
                                    }, 0)}
                                />
                            );
                        })}
                    </FooterContainer>
                )
            );
        };
    }, [JSON.stringify(rows), JSON.stringify(columns)]);
};

type FooterColumn = GridColDef & {colorize?: boolean; renderFooter?: () => ReactNode};
