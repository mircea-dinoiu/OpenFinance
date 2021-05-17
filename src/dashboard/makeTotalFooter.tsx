import {NumericValue} from 'app/formatters';
import React from 'react';
import {CashAccount} from 'dashboard/defs';
import {styled} from '@material-ui/core/styles';
import {GridFooter, GridFooterContainer} from '@material-ui/x-grid';

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

export const TotalFooter = ({rows, colorize = false}: {rows: CashAccount[]; colorize?: boolean}) => {
    const [first] = rows;

    return (
        first && (
            <FooterContainer>
                <NumericValue
                    colorize={colorize}
                    currency={Number(first.currency_id)}
                    before="Total: "
                    value={rows.reduce((acc, row) => acc + row.total, 0)}
                />
            </FooterContainer>
        )
    );
};

const FooterContainer = styled(GridFooterContainer)((props) => ({
    justifyContent: 'flex-end !important',
    padding: props.theme.spacing(0, 2),
}));
