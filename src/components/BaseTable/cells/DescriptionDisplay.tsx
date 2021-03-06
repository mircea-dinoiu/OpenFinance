import {Flags} from 'components/transactions/MainScreenFlags';
import {TransactionModel} from 'components/transactions/types';
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import {Card, CardContent} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {spacingSmall, theme} from 'defs/styles';

export function DescriptionDisplay({
    item,
    accessor,
    entity,
}: {
    item: TransactionModel;
    accessor: keyof TransactionModel;
    entity: string;
}) {
    const flags = <Flags entity={entity} item={item} />;
    const cls = useStyles();

    return (
        <>
            <div className={cls.grid}>
                <span>{flags}</span>
                <span>{item[accessor]}</span>
            </div>
            {item.notes && (
                <Card variant="outlined" className={cls.card}>
                    <CardContent className={cls.cardContent}>
                        <ReactMarkdown linkTarget="_blank">{item.notes}</ReactMarkdown>
                    </CardContent>
                </Card>
            )}
        </>
    );
}

const useStyles = makeStyles({
    grid: {
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gridGap: spacingSmall,
        whiteSpace: 'nowrap',
    },
    card: {
        marginTop: spacingSmall,
    },
    cardContent: {
        '&, &:last-child': {
            padding: spacingSmall,
        },
        '& p': {
            margin: 0,
        },
        '& a:link, a:visited': {
            color: theme.palette.warning.main,
        },
        whiteSpace: 'break-spaces',
    },
});
