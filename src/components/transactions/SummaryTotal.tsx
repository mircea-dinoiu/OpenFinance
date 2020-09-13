import {AccountValue} from 'components/transactions/AccountValue';
import {SummaryModel} from 'components/transactions/types';
import groupBy from 'lodash/groupBy';
import React from 'react';

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
    return (
        <>
            {Object.entries(groupBy(summaryItems, 'currencyId')).map(
                ([currencyId, items]) => {
                    const marketValue = items.reduce(
                        (acc, each) =>
                            !excludedRecord?.[each.reference]
                                ? acc + (each.marketValue ?? 0)
                                : acc,
                        0,
                    );
                    const cashValue = items.reduce(
                        (acc, each) =>
                            !excludedRecord?.[each.reference]
                                ? acc + (each.cashValue ?? 0)
                                : acc,
                        0,
                    );

                    return (
                        <AccountValue
                            marketValue={marketValue}
                            cashValue={cashValue}
                            colorize={colorize}
                            currencyId={Number(currencyId)}
                        />
                    );
                },
            )}
        </>
    );
};
