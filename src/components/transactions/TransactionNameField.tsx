import {Chip, TextField} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {Autocomplete} from '@material-ui/lab';
import {routes} from 'defs/routes';
import {sortBy} from 'lodash';
import React, {useState} from 'react';
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
    const [search, setSearch] = useState(value);
    const endDate = useEndDate();
    const {response: suggestionsResponse} = useReader<DescriptionSuggestion[]>({
        url: makeUrl(routes.transactionsSuggestions.descriptions, {
            search,
            end_date: endDate,
        }),
    });
    const suggestions = suggestionsResponse?.data
        ? sortBy(suggestionsResponse.data, (s) => -s.usages)
        : [];
    const cls = useStyles();

    return (
        <Autocomplete
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
                    onChange={(e) => setSearch(e.target.value)}
                    label="Name"
                />
            )}
            defaultValue={{item: value, usages: 0}}
            onChange={(event, v) => onChange(v.item)}
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
