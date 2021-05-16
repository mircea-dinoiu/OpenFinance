import {NumericValue} from 'app/formatters';
import {TransactionModel} from 'transactions/defs';
import {getItemCurrencyISOCode} from 'currencies/helpers';
import React from 'react';
import {useCurrenciesMap} from 'currencies/state';

export const AmountDisplay = ({
    item,
    isExpanded,
}: {
    item: Pick<TransactionModel, 'price' | 'money_location' | 'quantity' | 'stock_id'>;
    isExpanded?: boolean;
}) => {
    const currencies = useCurrenciesMap();
    const currencyISOCode = getItemCurrencyISOCode({
        item,
        currencies,
    });

    return (
        <NumericValue
            variant={isExpanded ? 'tableCell' : undefined}
            colorize={true}
            value={item.price * item.quantity}
            currency={currencyISOCode}
        />
    );
};
