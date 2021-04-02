import {debounce, TextField} from '@material-ui/core';
import {Timers} from 'app/timers';
import {QueryParam} from 'app/QueryParam';
import React, {useEffect, useMemo, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {mapUrlToFragment} from 'app/url';

export const TransactionsSearchField = () => {
    const history = useHistory();
    const [value, setValue] = useState('');
    const navigate = useMemo(() => debounce(history.replace, Timers.SEARCH_DEBOUNCE), [history.replace]);

    useEffect(() => {
        const url = new URL(window.location.href);

        url.search = '';
        url.searchParams.set(QueryParam.filters, JSON.stringify([{id: 'item', value: {text: value}}]));

        navigate(mapUrlToFragment(url));
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
