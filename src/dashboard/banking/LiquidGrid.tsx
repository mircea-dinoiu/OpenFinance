import {CashAccount} from '../defs';
import React, {useMemo} from 'react';
import {XGrid, GridFooterContainer} from '@material-ui/x-grid';
import {NameColX, ValueColX} from '../columns';
import {NumericValue} from '../../app/formatters';
import {styled} from '@material-ui/core/styles';

export const LiquidGrid = ({rows, cls}: {rows: CashAccount[]; cls: Record<string, string>}) => {
    const Footer = useMemo(() => {
        return () => <TotalFooter rows={rows} />;
    }, [JSON.stringify(rows)]);

    return (
        <XGrid
            autoHeight={true}
            sortModel={[{field: 'total', sort: 'desc'}]}
            className={cls.table}
            rows={rows}
            columns={[NameColX, ValueColX]}
            components={{
                Footer,
            }}
        />
    );
};

const TotalFooter = ({rows, colorize = false}: {rows: CashAccount[]; colorize?: boolean}) => {
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
