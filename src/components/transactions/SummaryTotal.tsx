import {NumericValue} from 'components/formatters';
import {SummaryModel} from 'components/transactions/types';
import {financialNum} from 'js/utils/numbers';
import groupBy from 'lodash/groupBy';
import React from 'react';
import {useCurrenciesMap} from 'state/currencies';

export const SummaryTotal = ({
    summaryItems,
    excludedRecord,
    colorize,
}: {
    summaryItems: Pick<
        SummaryModel,
        'cashValue' | 'marketValue' | 'reference' | 'currencyId'
    >[];
    excludedRecord?: Record<string, boolean>;
    colorize?: boolean;
}) => {
    const currencies = useCurrenciesMap();

    return (
        <>
            {Object.entries(groupBy(summaryItems, 'currencyId')).map(
                ([currencyId, items]) => {
                    const value = items.reduce((acc, each) => {
                        if (!excludedRecord?.[each.reference]) {
                            return acc + (each.marketValue || each.cashValue);
                        }

                        return acc;
                    }, 0);

                    return (
                        <div>
                            <NumericValue
                                currency={currencies[currencyId].iso_code}
                                value={financialNum(value)}
                                colorize={colorize}
                            />
                        </div>
                    );
                },
            )}
        </>
    );
};
