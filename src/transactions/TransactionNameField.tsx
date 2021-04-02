import {Chip, TextField} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {Autocomplete} from '@material-ui/lab';
import {Api} from 'app/Api';
import React from 'react';
import {useSelectedProject} from 'app/state/projects';
import {useReader} from 'app/utils/fetch';
import {makeUrl} from 'app/utils/url';

type DescriptionSuggestion = {
    item: string;
    usages: number;
};

export const TransactionNameField = ({value, onChange}: {value: string; onChange: (v: string) => void}) => {
    const project = useSelectedProject();
    const {response: suggestionsResponse} = useReader<{
        suggestions: DescriptionSuggestion[];
    }>({
        url: makeUrl(Api.transactionsSuggestions.descriptions, {
            search: value,
            projectId: project.id,
        }),
    });
    const suggestions = suggestionsResponse?.data.suggestions ?? [];
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
                    InputLabelProps={{shrink: true}}
                />
            )}
            defaultValue={{item: value, usages: 0}}
            onChange={(event: any, v: DescriptionSuggestion | null) => v && onChange(v.item)}
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
