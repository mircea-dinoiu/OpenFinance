import {CardHeader, Checkbox} from '@material-ui/core';
import {grey} from '@material-ui/core/colors';
import {makeStyles} from '@material-ui/core/styles';
import clsx from 'clsx';
import {useCardHeaderStyles} from 'components/transactions/styles';
import {SummaryExpander} from 'components/transactions/SummaryExpander';
import {SummaryModel} from 'components/transactions/types';
import {spacingMedium, spacingSmall, theme} from 'defs/styles';
import {convertCurrencyToDefault} from 'helpers/currency';
import {sortBy} from 'lodash';
import React, {ReactNode, useState} from 'react';
import {Currencies} from 'types';

export const SummarySubCategory = <Ent,>(props: {
    expandedByDefault: boolean;
    numericValueFn: (
        value: number,
        opts?: {
            currencyId?: number;
        },
    ) => JSX.Element;
    excluded: {};
    currencies: Currencies;
    onToggleExcluded: (ids: string[]) => void;
    entities: Ent[];
    entityIdField: keyof Ent;
    entityNameField: keyof Ent;
    id: string;
    items: SummaryModel[];
    renderDescription?: (sm: SummaryModel) => ReactNode;
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
    const cls = useStyles();

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
                    onClick={() => setExpanded(!expanded)}
                    action={<SummaryExpander isExpanded={expanded} />}
                    title={
                        Number(id) === 0 ? (
                            <em>Unclassified</em>
                        ) : (
                            entities.find(
                                (each) => (each[entityIdField] as any) == id,
                            )?.[entityNameField]
                        )
                    }
                />
            )}
            {(shouldGroup === false || expanded) && (
                <ul className={cls.list}>
                    {items.map((each) => (
                        <li className={cls.listItem}>
                            <div>
                                {renderDescription
                                    ? renderDescription(each)
                                    : each.description}
                            </div>
                            <div>
                                {props.numericValueFn(each.sum, {
                                    currencyId: Number(each.currencyId),
                                })}
                            </div>
                            <Checkbox
                                className={cls.checkbox}
                                checked={!props.excluded[each.reference]}
                                onChange={() =>
                                    props.onToggleExcluded([each.reference])
                                }
                                color="default"
                            />
                        </li>
                    ))}
                    <li className={clsx(cls.listItem, cls.listItemTotal)}>
                        <div>TOTAL</div>
                        <div>
                            {props.numericValueFn(
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
                        </div>
                        <div>
                            <Checkbox
                                className={cls.checkbox}
                                checked={items.every(
                                    (item) => !props.excluded[item.reference],
                                )}
                                onChange={() =>
                                    props.onToggleExcluded(
                                        items.map((item) => item.reference),
                                    )
                                }
                                color="default"
                            />
                        </div>
                    </li>
                </ul>
            )}
        </div>
    );
};

const useStyles = makeStyles({
    checkbox: {
        padding: 0,
    },
    list: {
        padding: 0,
        margin: 0,
    },
    listItem: {
        display: 'grid',
        gridTemplateColumns: '1fr auto auto',
        gridGap: spacingSmall,
        borderBottom: `1px solid ${grey[200]}`,
        padding: `${spacingSmall} 0`,
        alignItems: 'center',
        '&:hover': {
            backgroundColor: grey[100],
        },
    },
    listItemTotal: {
        backgroundColor: grey[100],
        fontWeight: 500,
    },
});
