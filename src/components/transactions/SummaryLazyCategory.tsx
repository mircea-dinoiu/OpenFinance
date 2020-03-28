import React from 'react';
import {SummaryCategory} from 'components/transactions/SummaryCategory';
import {createXHR} from 'utils/fetch';
import {Card, CardHeader, IconButton} from '@material-ui/core';
import {BigLoader} from 'components/loaders';
import {useRefreshWidgets} from 'state/hooks';
import {useCardHeaderStyles, headerColor} from 'components/transactions/styles';
import {UnfoldLess, UnfoldMore} from '@material-ui/icons';

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
        <Card style={{marginBottom: 10}}>
            <CardHeader
                classes={cardHeaderClasses}
                style={{backgroundColor}}
                action={
                    <IconButton onClick={() => setExpanded(!expanded)}>
                        {expanded ? <UnfoldLess /> : <UnfoldMore />}
                    </IconButton>
                }
                title={title}
            />

            {expanded && <BigLoader />}
        </Card>
    );
};
