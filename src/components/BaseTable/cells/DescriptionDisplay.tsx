import {Card, CardContent} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {Flags} from 'components/transactions/MainScreenFlags';
import {TransactionModel} from 'components/transactions/types';
import * as React from 'react';
import ReactMarkdown from 'react-markdown';

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

const useStyles = makeStyles(theme => ({
    grid: {
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gridGap: theme.spacing(1),
        whiteSpace: 'nowrap',
    },
    card: {
        marginTop: theme.spacing(1),
    },
    cardContent: {
        '&, &:last-child': {
            padding: theme.spacing(1),
        },
        '& p': {
            margin: 0,
        },
        '& ul': {
            paddingLeft: theme.spacing(3),
            margin: 0,
        },
        '& a:link, a:visited': {
            color: theme.palette.warning.main,
        },
        whiteSpace: 'break-spaces',
    },
}));
