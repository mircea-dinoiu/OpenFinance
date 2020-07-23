import {SummaryModel} from 'components/transactions/types';
import React from 'react';
import {
    SummaryCategory,
    SummaryCategoryProps,
} from 'components/transactions/SummaryCategory';
import {createXHR} from 'utils/fetch';
import {Card, CardHeader} from '@material-ui/core';
import {BigLoader} from 'components/loaders';
import {useRefreshWidgets} from 'state/hooks';
import {useCardHeaderStyles} from 'components/transactions/styles';
import {SummaryExpander} from 'components/transactions/SummaryExpander';

export const SummaryLazyCategory = <Raw, Ent extends {id:  number}>({
    expandedByDefault = false,
    url,
    parser,
    ...props
}: Omit<
    SummaryCategoryProps<Ent>,
    'expanded' | 'setExpanded' | 'summaryObject'
> & {
    url: string;
    parser: (r: Raw) => SummaryModel[];
}) => {
    const cardHeaderClasses = useCardHeaderStyles();
    const [expanded, setExpanded] = React.useState(expandedByDefault);
    const [data, setData] = React.useState<Raw | null>(null);
    const {backgroundColor, title} = props;
    const refreshWidgets = useRefreshWidgets();

    React.useEffect(() => {
        if (expanded) {
            createXHR<Raw>({
                url,
            }).then((response) => setData(response.data));
        }
    }, [expanded, refreshWidgets, url]);

    if (data) {
        return (
            <SummaryCategory<Ent>
                {...props}
                summaryObject={parser(data)}
                expanded={expanded}
                setExpanded={setExpanded}
                expandedByDefault={expandedByDefault}
            />
        );
    }

    return (
        <Card>
            <CardHeader
                classes={cardHeaderClasses}
                style={{backgroundColor}}
                action={
                    <SummaryExpander
                        isExpanded={expanded}
                        onChange={setExpanded}
                    />
                }
                title={title}
            />

            {expanded && <BigLoader />}
        </Card>
    );
};
