import {convertCurrencyToDefault} from 'helpers/currency';

import React from 'react';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import {Card, CardHeader, IconButton} from '@material-ui/core';
import {financialNum} from 'js/utils/numbers';
import {SummarySubCategory} from 'components/transactions/SummarySubCategory';
import {numericValue} from 'components/formatters';
import {useCurrencies} from 'state/currencies';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';
import {makeStyles} from '@material-ui/core/styles';
import {spacingSmall} from 'defs/styles';

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

export const headerColor = 'rgba(255, 255, 255, 0.9)';

const useStyles = makeStyles({
    expandable: {
        padding: spacingSmall,
    },
});
const useCardHeaderStyles = makeStyles({
    title: {
        fontSize: 'medium',
    },
    subheader: {
        fontSize: 'small',
    },
    action: {
        margin: 0,
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
        <Card style={{marginBottom: 10}}>
            <CardHeader
                style={{backgroundColor, color: headerColor}}
                title={title}
                classes={cardHeaderClasses}
                action={
                    <IconButton onClick={() => setExpanded(!expanded)}>
                        {expanded ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
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
