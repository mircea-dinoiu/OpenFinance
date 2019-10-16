import React from 'react';
import SummaryCategory from './SummaryCategory';
import {BigLoader} from '../../loaders';
import {createXHR} from '../../../utils/fetch';

export const SummaryLazyCategory = ({
    deps,
    expandedByDefault = false,
    url,
    parser,
    ...props
}) => {
    const [expanded, setExpanded] = React.useState(expandedByDefault);
    const [data, setData] = React.useState(null);

    React.useEffect(() => {
        if (expanded) {
            createXHR<{
                [key: string]: number;
            }>({
                url,
            }).then((response) => setData(response.data));
        }
    }, [expanded, ...deps]);

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

    return <BigLoader />;
};
