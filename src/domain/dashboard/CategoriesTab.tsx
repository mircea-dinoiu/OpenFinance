import {CardHeader} from '@material-ui/core';
import {useCategories} from 'domain/categories/state';
import {useSummaryResults} from 'domain/dashboard/useSummaryResults';
import {BigLoader} from 'components/loaders';
import {SummaryCategory} from 'components/transactions/SummaryCategory';
import * as React from 'react';

export const CategoriesTab = ({reportQueryParams}: {reportQueryParams: string}) => {
    const categories = useCategories();
    const results = useSummaryResults({reportQueryParams});

    return (
        <>
            <CardHeader title="Categories" />

            {results ? (
                <SummaryCategory
                    summaryObject={results.expensesByCategory}
                    entities={categories}
                    entityNameField="name"
                />
            ) : (
                <BigLoader />
            )}
        </>
    );
};
