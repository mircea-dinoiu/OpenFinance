import {Card, CardHeader} from '@material-ui/core';
import {BigLoader} from 'components/loaders';
import {useCardHeaderStyles} from 'components/transactions/styles';
import {SummaryCategory, SummaryCategoryProps} from 'components/transactions/SummaryCategory';
import {SummaryExpander} from 'components/transactions/SummaryExpander';
import {SummaryModel} from 'components/transactions/types';
import React from 'react';
import {useDispatch} from 'react-redux';
import {useRefreshWidgets} from 'state/hooks';
import {summaryAssign, SummaryKey} from 'state/summary';
import {createXHR} from 'utils/fetch';

export const SummaryLazyCategory = <Raw, Ent extends {id: number}>({
    expandedByDefault = false,
    url,
    parser,
    globalStateKey,
    ...props
}: Omit<
    SummaryCategoryProps<Ent>,
    'expanded' | 'setExpanded' | 'summaryObject'
> & {
    globalStateKey: SummaryKey;
    url: string;
    parser: (r: Raw) => SummaryModel[];
}) => {
    const cardHeaderClasses = useCardHeaderStyles();
    const [expanded, setExpanded] = React.useState(expandedByDefault);
    const [data, setData] = React.useState<Raw | null>(null);
    const {backgroundColor, title} = props;
    const refreshWidgets = useRefreshWidgets();
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (expanded) {
            createXHR<Raw>({
                url,
            }).then((response) => {
                dispatch(summaryAssign(globalStateKey, response.data as any));
                setData(response.data);
            });
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
