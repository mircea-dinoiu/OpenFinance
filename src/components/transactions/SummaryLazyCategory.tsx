import React from 'react';
import {SummaryCategory} from 'components/transactions/SummaryCategory';
import {createXHR} from 'utils/fetch';
import {Card, CardHeader} from '@material-ui/core';
import {BigLoader} from 'components/loaders';
import {useRefreshWidgets} from 'state/hooks';
import {useCardHeaderStyles} from 'components/transactions/styles';
import {SummaryExpander} from 'components/transactions/SummaryExpander';

export const SummaryLazyCategory = ({
    expandedByDefault = false,
    url,
    parser,
    ...props
}) => {
    const cardHeaderClasses = useCardHeaderStyles();
    const [expanded, setExpanded] = React.useState(expandedByDefault);
    const [data, setData] = React.useState(null);
    const {backgroundColor, title} = props;
    const refreshWidgets = useRefreshWidgets();

    React.useEffect(() => {
        if (expanded) {
            createXHR<{
                [key: string]: number;
            }>({
                url,
            }).then((response) => setData(response.data));
        }
    }, [expanded, refreshWidgets, url]);

    if (data) {
        return (
            <SummaryCategory
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
