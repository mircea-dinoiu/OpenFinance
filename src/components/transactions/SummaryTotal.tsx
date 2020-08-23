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
    summaryItems: Pick<SummaryModel, 'sum' | 'reference' | 'currencyId'>[];
    excludedRecord?: Record<string, boolean>;
    colorize?: boolean;
}) => {
    const currencies = useCurrenciesMap();

    return (
        <>
            {Object.entries(groupBy(summaryItems, 'currencyId')).map(
                ([currencyId, items]) => (
                    <div>
                        <NumericValue
                            currency={currencies[currencyId].iso_code}
                            value={financialNum(
                                items.reduce(
                                    (acc, each) =>
                                        acc +
                                        (excludedRecord?.[each.reference]
                                            ? 0
                                            : each.sum),
                                    0,
                                ),
                            )}
                            colorize={colorize}
                        />
                    </div>
                ),
            )}
        </>
    );
};
