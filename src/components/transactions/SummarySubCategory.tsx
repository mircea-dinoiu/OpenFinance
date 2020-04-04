import React, {ReactNode, useState} from 'react';
import {CardHeader, Checkbox, FormControlLabel} from '@material-ui/core';
import {convertCurrencyToDefault} from 'helpers/currency';
import {BaseTable} from 'components/BaseTable';
import {spacingMedium, spacingSmall, theme} from 'defs/styles';
import {sortBy} from 'lodash';
import {Currencies} from 'types';
import {useCardHeaderStyles} from 'components/transactions/styles';
import {SummaryExpander} from 'components/transactions/SummaryExpander';

type SummarySubCategoryModel = {
    description: string;
    reference: string;
    currencyId: number;
    sum: number;
};

export const SummarySubCategory = (props: {
    expandedByDefault: boolean;
    numericValueFn: (
        value: number,
        opts: {
            currencyId?: number;
            currencyStyle?: {};
        },
    ) => string;
    excluded: {};
    currencies: Currencies;
    onToggleExcluded: (boolean) => void;
    entities: [];
    entityIdField: string;
    entityNameField: string;
    id: string;
    items: SummarySubCategoryModel[];
    renderDescription: (cat: SummarySubCategoryModel) => ReactNode;
    shouldGroup: boolean;
}) => {
    const cardHeaderClasses = useCardHeaderStyles();
    const [expanded, setExpanded] = useState(props.expandedByDefault);
    const {
        shouldGroup,
        entities,
        id,
        entityIdField,
        entityNameField,
        items: itemsFromProps,
        renderDescription,
    } = props;

    const items = sortBy(itemsFromProps, (item) => item.description);
    const numericValue = (value, opts?) => props.numericValueFn(value, opts);

    return (
        <div style={{padding: '0 5px', marginBottom: spacingMedium}}>
            {shouldGroup && (
                <CardHeader
                    classes={cardHeaderClasses}
                    style={{
                        padding: 0,
                        marginTop: Number(id) === 0 ? 5 : 0,
                        cursor: 'pointer',
                        color: theme.palette.text.primary,
                    }}
                    action={
                        <SummaryExpander
                            isExpanded={expanded}
                            onChange={setExpanded}
                        />
                    }
                    title={
                        Number(id) === 0 ? (
                            <em>Unclassified</em>
                        ) : (
                            entities.find((each) => each[entityIdField] == id)[
                                entityNameField
                            ]
                        )
                    }
                    subheader={numericValue(
                        items.reduce(
                            // @ts-ignore
                            (acc, each) =>
                                acc +
                                (props.excluded[each.reference]
                                    ? 0
                                    : convertCurrencyToDefault(
                                          each.sum,
                                          each.currencyId,
                                          props.currencies,
                                      )),
                            0,
                        ),
                    )}
                />
            )}
            {(shouldGroup === false || expanded) && (
                <BaseTable<SummarySubCategoryModel>
                    data={items}
                    hideHeader={true}
                    columns={[
                        {
                            id: 'description',
                            accessor: (each) => (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            style={{
                                                padding: `0 ${spacingSmall} 0 ${spacingMedium}`,
                                            }}
                                            checked={
                                                !props.excluded[each.reference]
                                            }
                                            onChange={() =>
                                                props.onToggleExcluded(
                                                    each.reference,
                                                )
                                            }
                                            color="default"
                                        />
                                    }
                                    label={
                                        <span style={{fontWeight: 300}}>
                                            {renderDescription
                                                ? renderDescription(each)
                                                : each.description}
                                        </span>
                                    }
                                />
                            ),
                        },
                        {
                            id: 'sum',
                            accessor: (each) =>
                                numericValue(each.sum, {
                                    currencyId: each.currencyId,
                                }),
                            style: {textAlign: 'right'},
                        },
                    ]}
                />
            )}
        </div>
    );
};
