// @flow weak
import {convertCurrencyToDefault} from 'common/helpers/currency';
import {objectEntriesOfSameType} from 'common/utils/collection';

import React from 'react';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import {Card, CardHeader, CardText} from 'material-ui';
import {financialNum} from 'shared/utils/numbers';
import {SummarySubCategory} from 'mobile/ui/internal/summary/SummarySubCategory';
import {numericValue} from 'mobile/ui/formatters';
import {useCurrencies} from 'common/state/hooks';

const groupSorter = ([, items]) => {
    if (items.length > 0) {
        // $FlowFixMe
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

const SummaryCategory = (props) => {
    const currencies = useCurrencies();
    const {
        backgroundColor,
        title,
        summaryObject,
        expandedByDefault,
        entities,
        entityIdField = 'id',
        entityNameField = 'name',
        showSumInHeader,
    } = props;
    const headerColor = 'rgba(255, 255, 255, 0.9)';
    const [expanded, setExpanded] = React.useState(Boolean(props.expandedByDefault))
    const [excluded, setExcluded] = React.useState({})

    const handleToggleExcluded = (id) => {
        setExcluded({...excluded, [id]: !excluded[id]})
    };

    const handleExpandChange = (value) => {
        setExpanded(value)
    };

    const numericValueProxy = (
        value,
        {currencyId = currencies.default, ...opts} = {},
    ) => {
        const currency = currencies.map[currencyId].iso_code;

        return numericValue(value, {...opts, currency});
    };

    return (
        <Card
            style={{marginBottom: 10}}
            expanded={expanded}
            onExpandChange={handleExpandChange}
        >
            <CardHeader
                style={{backgroundColor, paddingTop: 0}}
                actAsExpander={true}
                showExpandableButton={true}
            >
                <div style={{color: headerColor}}>
                    {title}
                    {showSumInHeader && (
                        <div style={{fontSize: '12px'}}>
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
                    )}
                </div>
            </CardHeader>

            <CardText style={{padding: '0 5px'}} expandable={true}>
                {sortBy(
                    objectEntriesOfSameType(groupBy(summaryObject, 'group')),
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
            </CardText>
        </Card>
    );
};

SummaryCategory.defaultProps = {
    showSumInHeader: true,
};

export default SummaryCategory;
