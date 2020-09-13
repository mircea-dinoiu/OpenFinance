import {NumericValue} from 'components/formatters';
import {financialNum} from 'js/utils/numbers';
import React from 'react';
import {useCurrenciesMap} from 'state/currencies';

export const AccountValue = ({
    marketValue,
    cashValue,
    colorize,
    currencyId,
}: {
    marketValue: number;
    cashValue: number;
    colorize?: boolean;
    currencyId: number;
}) => {
    const currencies = useCurrenciesMap();
    const currency = currencies[currencyId].iso_code;

    if (marketValue) {
        return (
            <div>
                <NumericValue
                    currency={currency}
                    value={financialNum(marketValue)}
                    colorize={colorize}
                    tooltip={
                        <>
                            <div>
                                Invested:{' '}
                                {
                                    <NumericValue
                                        currency={currency}
                                        value={financialNum(cashValue)}
                                        colorize={false}
                                    />
                                }
                            </div>
                            <div>
                                ROI:{' '}
                                {
                                    <NumericValue
                                        currency={currency}
                                        value={financialNum(
                                            marketValue - cashValue,
                                        )}
                                        colorize={false}
                                    />
                                }
                            </div>
                        </>
                    }
                />
            </div>
        );
    }

    return (
        <div>
            <NumericValue
                currency={currency}
                value={financialNum(cashValue)}
                colorize={colorize}
            />
        </div>
    );
};
