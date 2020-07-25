import {Chip, TextField} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {Autocomplete} from '@material-ui/lab';
import {routes} from 'defs/routes';
import {sortBy} from 'lodash';
import React from 'react';
import {useSelectedProject} from 'state/projects';
import {useEndDate} from 'utils/dates';
import {useReader} from 'utils/fetch';
import {makeUrl} from 'utils/url';

type DescriptionSuggestion = {
    item: string;
    usages: number;
};

export const TransactionNameField = ({
    value,
    onChange,
}: {
    value: string;
    onChange: (v: string) => void;
}) => {
    const endDate = useEndDate();
    const project = useSelectedProject();
    const {response: suggestionsResponse} = useReader<DescriptionSuggestion[]>({
        url: makeUrl(routes.transactionsSuggestions.descriptions, {
            search: value,
            end_date: endDate,
            projectId: project.id,
        }),
    });
    const suggestions = suggestionsResponse?.data
        ? sortBy(suggestionsResponse.data, (s) => -s.usages)
        : [];
    const cls = useStyles();

    return (
        <Autocomplete<DescriptionSuggestion>
            freeSolo={true}
            options={suggestions}
            getOptionLabel={(o) => o.item}
            disableClearable
            renderOption={(o) => (
                <div className={cls.option}>
                    <div>{o.item}</div>
                    <Chip label={`${o.usages} entries`} size="small" />
                </div>
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    onChange={(e) => onChange(e.target.value)}
                    label="Name"
                />
            )}
            defaultValue={{item: value, usages: 0}}
            onChange={(event: any, v: DescriptionSuggestion | null) =>
                v && onChange(v.item)
            }
        />
    );
};

const useStyles = makeStyles({
    option: {
        display: 'grid',
        width: '100%',
        gridTemplateColumns: '1fr auto',
        alignItems: 'center',
    },
});
