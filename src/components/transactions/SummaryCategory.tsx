import {Card, CardHeader} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {numericValue} from 'components/formatters';
import {headerColor, useCardHeaderStyles} from 'components/transactions/styles';
import {SummaryExpander} from 'components/transactions/SummaryExpander';
import {SummarySubCategory} from 'components/transactions/SummarySubCategory';
import {SummaryModel} from 'components/transactions/types';
import {spacingSmall} from 'defs/styles';
import {convertCurrencyToDefault} from 'helpers/currency';
import {financialNum} from 'js/utils/numbers';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';

import React, {ReactNode} from 'react';
import {useCurrencies} from 'state/currencies';

const groupSorter = ([, items]: [unknown, SummaryModel[]]) => {
    if (items.length > 0) {
        // @ts-ignore
        const [firstItem] = items;

        if (firstItem.index != null) {
            return firstItem.index;
        }

        if (firstItem.group != null) {
            return firstItem.group;
        }
    }

    return 0;
};

const useStyles = makeStyles({
    expandable: {
        padding: spacingSmall,
    },
});

export type SummaryCategoryProps<Ent> = {
    backgroundColor: string;
    title: string;
    summaryObject: SummaryModel[];
    expandedByDefault?: boolean;
    entities: Ent[];
    entityIdField?: keyof Ent;
    entityNameField: keyof Ent;
    showSumInHeader?: boolean;
    setExpanded?: (e: boolean) => void;
    expanded?: boolean;
    renderDescription?: (cat: SummaryModel) => ReactNode;
};

export const SummaryCategory = <Ent extends {id: number}>(
    props: SummaryCategoryProps<Ent>,
) => {
    const cls = useStyles();
    const cardHeaderClasses = useCardHeaderStyles();
    const currencies = useCurrencies();
    const {
        backgroundColor,
        title,
        summaryObject,
        expandedByDefault = false,
        entities,
        entityIdField = 'id',
        entityNameField,
        showSumInHeader,
    } = props;
    const expandedState = React.useState(expandedByDefault);
    const [expanded, setExpanded] = props.setExpanded
        ? [props.expanded, props.setExpanded]
        : expandedState;
    const [excluded, setExcluded] = React.useState({});

    const handleToggleExcluded = (ids: string[]) => {
        const next = {...excluded};

        for (const id of ids) {
            next[id] = !excluded[id];
        }

        setExcluded(next);
    };

    const numericValueProxy = (
        value: number,
        {
            currencyId = currencies.selected.id,
            ...opts
        }: {
            currencyId?: number;
        } = {},
    ) => {
        const currency = currencies[String(currencyId)].iso_code;

        return numericValue(value, {...opts, currency});
    };

    return (
        <Card>
            <CardHeader
                style={{backgroundColor}}
                title={title}
                classes={cardHeaderClasses}
                onClick={() => setExpanded(!expanded)}
                action={<SummaryExpander isExpanded={Boolean(expanded)} />}
                subheader={
                    showSumInHeader && (
                        <div style={{color: headerColor}}>
                            {numericValueProxy(
                                financialNum(
                                    summaryObject.reduce(
                                        (acc, each) =>
                                            acc +
                                            (excluded[each.reference]
                                                ? 0
                                                : convertCurrencyToDefault(
                                                      each.sum,
                                                      each.currencyId,
                                                      currencies,
                                                  )),
                                        0,
                                    ),
                                ),
                            )}
                        </div>
                    )
                }
            >
                <div style={{color: headerColor}}>{title}</div>
            </CardHeader>

            {expanded && (
                <div className={cls.expandable}>
                    {sortBy(
                        Object.entries(groupBy(summaryObject, 'group')),
                        groupSorter,
                    ).map(([id, items]) => {
                        const shouldGroup = items.every((each) =>
                            each.hasOwnProperty('group'),
                        );

                        return (
                            <SummarySubCategory<Ent>
                                key={id}
                                excluded={excluded}
                                shouldGroup={shouldGroup}
                                id={id}
                                items={items}
                                numericValueFn={numericValueProxy}
                                entities={entities}
                                entityIdField={entityIdField}
                                entityNameField={entityNameField}
                                expandedByDefault={expandedByDefault}
                                currencies={currencies}
                                onToggleExcluded={handleToggleExcluded}
                                renderDescription={props.renderDescription}
                            />
                        );
                    })}
                </div>
            )}
        </Card>
    );
};

SummaryCategory.defaultProps = {
    showSumInHeader: true,
};
