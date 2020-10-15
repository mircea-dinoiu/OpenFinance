import {makeStyles} from '@material-ui/core/styles';
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
    summaryObject: SummaryModel[];
    entities: Ent[];
    entityIdField?: keyof Ent;
    entityNameField: keyof Ent;
    renderDescription?: (cat: SummaryModel) => ReactNode;
};

export const SummaryCategory = <Ent extends {id: number}>(props: SummaryCategoryProps<Ent>) => {
    const cls = useStyles();
    const currencies = useCurrenciesMap();
    const {summaryObject, entities, entityIdField = 'id', entityNameField} = props;
    const [excluded, setExcluded] = React.useState<Record<string, boolean>>({});

    const handleToggleExcluded = (ids: string[]) => {
        const next = {...excluded};

        for (const id of ids) {
            next[id] = !excluded[id];
        }

        setExcluded(next);
    };

    return (
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
                        currencies={currencies}
                        onToggleExcluded={handleToggleExcluded}
                        renderDescription={props.renderDescription}
                    />
                );
            })}
        </div>
    );
};
