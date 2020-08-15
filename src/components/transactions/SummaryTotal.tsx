import {numericValue} from 'components/formatters';
import {SummaryModel} from 'components/transactions/types';
import {financialNum} from 'js/utils/numbers';
import groupBy from 'lodash/groupBy';
import React from 'react';
import {useCurrencies} from 'state/currencies';

export const SummaryTotal = ({
    summaryItems,
    excludedRecord,
}: {
    summaryItems: Pick<SummaryModel, 'sum' | 'reference' | 'currencyId'>[];
    excludedRecord?: Record<string, boolean>;
}) => {
    const currencies = useCurrencies();

    return (
        <>
            {Object.entries(groupBy(summaryItems, 'currencyId')).map(
                ([currencyId, items]) => (
                    <div>
                        {numericValue(
                            financialNum(
                                items.reduce(
                                    (acc, each) =>
                                        acc +
                                        (excludedRecord?.[each.reference]
                                            ? 0
                                            : each.sum),
                                    0,
                                ),
                            ),
                            currencies[currencyId].iso_code,
                        )}
                    </div>
                ),
            )}
        </>
    );
};
