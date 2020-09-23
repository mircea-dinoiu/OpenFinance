import {Card, CardHeader} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {headerColor, useCardHeaderStyles} from 'components/transactions/styles';
import {SummaryExpander} from 'components/transactions/SummaryExpander';
import {SummarySubCategory} from 'components/transactions/SummarySubCategory';
import {SummaryModel} from 'components/transactions/types';
import {spacingSmall} from 'defs/styles';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';

import React, {ReactNode} from 'react';
import {useCurrenciesMap} from 'state/currencies';

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
    setExpanded?: (e: boolean) => void;
    expanded?: boolean;
    renderDescription?: (cat: SummaryModel) => ReactNode;
};

export const SummaryCategory = <Ent extends {id: number}>(props: SummaryCategoryProps<Ent>) => {
    const cls = useStyles();
    const cardHeaderClasses = useCardHeaderStyles();
    const currencies = useCurrenciesMap();
    const {
        backgroundColor,
        title,
        summaryObject,
        expandedByDefault = false,
        entities,
        entityIdField = 'id',
        entityNameField,
    } = props;
    const expandedState = React.useState(expandedByDefault);
    const [expanded, setExpanded] = props.setExpanded ? [props.expanded, props.setExpanded] : expandedState;
    const [excluded, setExcluded] = React.useState<Record<string, boolean>>({});

    const handleToggleExcluded = (ids: string[]) => {
        const next = {...excluded};

        for (const id of ids) {
            next[id] = !excluded[id];
        }

        setExcluded(next);
    };

    return (
        <Card>
            <CardHeader
                style={{backgroundColor}}
                title={title}
                classes={cardHeaderClasses}
                onClick={() => setExpanded(!expanded)}
                action={<SummaryExpander isExpanded={Boolean(expanded)} />}
            >
                <div style={{color: headerColor}}>{title}</div>
            </CardHeader>

            {expanded && (
                <div className={cls.expandable}>
                    {sortBy(Object.entries(groupBy(summaryObject, 'group')), ([, items]: [unknown, SummaryModel[]]) => {
                        if (items.length > 0) {
                            const [firstItem] = items;
                            const {index, group} = firstItem;

                            if (index != null) {
                                return index;
                            }

                            if (group != null) {
                                return entities.find((e) => {
                                    return (
                                        // @ts-ignore
                                        e[entityIdField] === group
                                    );
                                })?.[entityNameField];
                            }
                        }

                        return 0;
                    }).map(([id, items]) => {
                        const shouldGroup = items.every((each) => each.hasOwnProperty('group'));

                        return (
                            <SummarySubCategory<Ent>
                                key={id}
                                excluded={excluded}
                                shouldGroup={shouldGroup}
                                id={id}
                                items={items}
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
