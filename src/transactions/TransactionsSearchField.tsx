import {debounce, TextField} from '@material-ui/core';
import {QueryParam} from 'app/QueryParam';
import {Timers} from 'app/timers';
import React, {useEffect, useMemo, useState} from 'react';
import {useHistory, useLocation} from 'react-router-dom';

export const TransactionsSearchField = () => {
    const history = useHistory();
    const location = useLocation();
    const [value, setValue] = useState('');
    const navigate = useMemo(() => debounce(history.replace, Timers.SEARCH_DEBOUNCE), [history.replace]);

    useEffect(() => {
        const searchParams = new URLSearchParams();

        searchParams.set(QueryParam.filters, JSON.stringify([{id: 'item', value: {text: value}}]));

        navigate({
            ...location,
            search: searchParams.toString(),
        });
    }, [value]);

    return (
        <TextField
            type="search"
            fullWidth={true}
            placeholder="Search Transactions"
            value={value}
            onChange={(e) => {
                setValue(e.target.value);
            }}
        />
    );
};
