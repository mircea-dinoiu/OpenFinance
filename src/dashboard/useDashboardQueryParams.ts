import {getEndDateBasedOnIncludePreference, useInclude, useIncludePending} from 'include/helpers';
import {TransactionStatus} from 'transactions/defs';
import identity from 'lodash/identity';
import pickBy from 'lodash/pickBy';
import {useSelectedProject} from 'projects/state';
import {getStartDate} from 'app/dates/helpers';

export const useDashboardQueryParams = ({endDate}: {endDate: string}) => {
    const [includePending] = useIncludePending();
    const [include] = useInclude();
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
