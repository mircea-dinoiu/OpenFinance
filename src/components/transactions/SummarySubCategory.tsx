import {Box, CardHeader, Checkbox} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import clsx from 'clsx';
import {NumericValue} from 'components/formatters';
import {useCardHeaderStyles} from 'components/transactions/styles';
import {SummaryTotal} from 'components/transactions/SummaryTotal';
import {SummaryModel} from 'components/transactions/types';
import {colors, theme} from 'defs/styles';
import {sortBy} from 'lodash';
import React, {ReactNode} from 'react';
import {CurrencyMap} from 'types';

export const SummarySubCategory = <Ent,>(props: {
    excluded: {};
    currencies: CurrencyMap;
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
    const {shouldGroup, entities, id, entityIdField, entityNameField, items: itemsFromProps, renderDescription} = props;

    const items = sortBy(itemsFromProps, (item) => item.description);
    const cls = useStyles();

    return (
        <Box paddingX={1} marginBottom={2}>
            {shouldGroup && (
                <CardHeader
                    classes={cardHeaderClasses}
                    style={{
                        padding: 0,
                        marginTop: Number(id) === 0 ? 5 : 0,
                        cursor: 'pointer',
                        color: theme.palette.text.primary,
                    }}
                    title={
                        Number(id) === 0 ? (
                            <em>Unclassified</em>
                        ) : (
                            entities.find((each) => (each[entityIdField] as any) == id)?.[entityNameField]
                        )
                    }
                />
            )}
            <ul className={cls.list}>
                {items.map((each) => (
                    <li className={cls.listItem}>
                        <div>{renderDescription ? renderDescription(each) : each.description}</div>
                        <div>
                            <NumericValue value={each.cashValue} currency={Number(each.currencyId)} />
                        </div>
                        <Checkbox
                            className={cls.checkbox}
                            checked={!props.excluded[each.reference]}
                            onChange={() => props.onToggleExcluded([each.reference])}
                            color="default"
                        />
                    </li>
                ))}
                <li className={clsx(cls.listItem, cls.listItemTotal)}>
                    <div>TOTAL</div>
                    <div style={{textAlign: 'right'}}>
                        <SummaryTotal summaryItems={items} excludedRecord={props.excluded} />
                    </div>
                    <div>
                        <Checkbox
                            className={cls.checkbox}
                            checked={items.every((item) => !props.excluded[item.reference])}
                            onChange={() => props.onToggleExcluded(items.map((item) => item.reference))}
                            color="default"
                        />
                    </div>
                </li>
            </ul>
        </Box>
    );
};

const useStyles = makeStyles((theme) => ({
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
        gridGap: theme.spacing(1),
        borderBottom: `1px solid ${colors.borderSecondary}`,
        padding: theme.spacing(1, 0),
        alignItems: 'center',
        '&:hover': {
            backgroundColor: colors.hover,
        },
    },
    listItemTotal: {
        backgroundColor: colors.tableFoot,
        fontWeight: 500,
    },
}));
