import {TransactionStatus} from 'transactions/defs';
import {getEndDateBasedOnIncludePreference, useInclude, useIncludePending} from 'transactions/helpers';
import identity from 'lodash/identity';
import pickBy from 'lodash/pickBy';
import {useSelectedProject} from 'app/state/projects';
import {getStartDate, useEndDate} from 'app/dates/helpers';

export const useDashboardQueryParams = () => {
    const [includePending] = useIncludePending();
    const [include] = useInclude();
    const [endDate] = useEndDate();
    const project = useSelectedProject();

    return new URLSearchParams({
        ...pickBy(
            {
                end_date: getEndDateBasedOnIncludePreference(endDate, include),
                start_date: getStartDate({
                    include,
                    endDate,
                }),
                projectId: project.id,
            },
            identity,
        ),
        include_pending: String(includePending),
        filters: JSON.stringify(includePending ? [] : [{id: 'status', value: TransactionStatus.finished}]),
    }).toString();
};
