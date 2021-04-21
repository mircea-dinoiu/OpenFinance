import {NumericValue} from 'app/formatters';
import {SummaryModel} from 'transactions/defs';
import {financialNum} from 'js/utils/numbers';
import groupBy from 'lodash/groupBy';
import React from 'react';

export const SummaryTotal = ({
    summaryItems,
    excludedRecord,
    colorize,
}: {
    summaryItems: Pick<SummaryModel, 'cashValue' | 'reference' | 'currencyId'>[];
    excludedRecord?: Record<string, boolean>;
    colorize?: boolean;
}) => {
    return (
        <>
            {Object.entries(groupBy(summaryItems, 'currencyId')).map(([currencyId, items]) => {
                let cashValue = 0;

                items.forEach((item) => {
                    cashValue += !excludedRecord?.[item.reference] ? item.cashValue ?? 0 : 0;
                });

                return (
                    <div>
                        <NumericValue
                            currency={Number(currencyId)}
                            value={financialNum(cashValue)}
                            colorize={colorize}
                        />
                    </div>
                );
            })}
        </>
    );
};
