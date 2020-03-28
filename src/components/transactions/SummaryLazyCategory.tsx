import React from 'react';
import {SummaryCategory, headerColor} from 'components/transactions/SummaryCategory';
import {createXHR} from 'utils/fetch';
import {Card, CardHeader, CardText} from 'material-ui';
import {BigLoader} from 'components/loaders';
import {useRefreshWidgets} from 'state/hooks';

export const SummaryLazyCategory = ({
    expandedByDefault = false,
    url,
    parser,
    ...props
}) => {
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
        <Card
            style={{marginBottom: 10}}
            expanded={expanded}
            onExpandChange={setExpanded}
        >
            <CardHeader
                style={{backgroundColor, paddingTop: 0}}
                actAsExpander={true}
                showExpandableButton={true}
            >
                <div style={{color: headerColor}}>{title}</div>
            </CardHeader>

            <CardText expandable={true}>
                <BigLoader />
            </CardText>
        </Card>
    );
};
