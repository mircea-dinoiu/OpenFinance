import {convertCurrencyToDefault} from 'helpers/currency';

import React from 'react';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import {Card, CardHeader} from '@material-ui/core';
import {financialNum} from 'js/utils/numbers';
import {SummarySubCategory} from 'components/transactions/SummarySubCategory';
import {numericValue} from 'components/formatters';
import {useCurrencies} from 'state/currencies';
import {makeStyles} from '@material-ui/core/styles';
import {spacingSmall} from 'defs/styles';
import {useCardHeaderStyles, headerColor} from 'components/transactions/styles';
import {SummaryExpander} from 'components/transactions/SummaryExpander';

const groupSorter = ([, items]) => {
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

export const SummaryCategory = (props) => {
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
        entityNameField = 'name',
        showSumInHeader,
    } = props;
    const expandedState = React.useState(expandedByDefault);
    const [expanded, setExpanded] = props.setExpanded
        ? [props.expanded, props.setExpanded]
        : expandedState;
    const [excluded, setExcluded] = React.useState({});

    const handleToggleExcluded = (id) => {
        setExcluded({...excluded, [id]: !excluded[id]});
    };

    const numericValueProxy = (
        value: number,
        {
            currencyId = currencies.selected.id,
            ...opts
        }: {
            currencyId?: number;
            currencyStyle?: {};
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
                action={
                    <SummaryExpander
                        isExpanded={expanded}
                        onChange={setExpanded}
                    />
                }
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
                                {currencyStyle: {color: headerColor}},
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
                            <SummarySubCategory
                                key={id}
                                excluded={excluded}
                                shouldGroup={shouldGroup}
                                id={id}
                                items={items}
                                // @ts-ignore
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
