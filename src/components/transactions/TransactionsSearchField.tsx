import {debounce, Paper, TextField} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {Timers} from 'defs';
import {spacingSmall} from 'defs/styles';
import {QueryParam} from 'defs/url';
import React, {useEffect, useMemo, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {mapUrlToFragment} from 'utils/url';

export const TransactionsSearchField = () => {
    const history = useHistory();
    const cls = useStyles();
    const [value, setValue] = useState('');
    const navigate = useMemo(
        () => debounce(history.replace, Timers.SEARCH_DEBOUNCE),
        [history.replace],
    );

    useEffect(() => {
        const url = new URL(window.location.href);

        url.search = '';
        url.searchParams.set(
            QueryParam.filters,
            JSON.stringify([{id: 'item', value: {text: value}}]),
        );

        navigate(mapUrlToFragment(url));
    }, [value]);

    return (
        <Paper className={cls.paper} square={true}>
            <TextField
                type="search"
                fullWidth={true}
                label="Search Transactions"
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                }}
            />
        </Paper>
    );
};

const useStyles = makeStyles({
    paper: {
        padding: spacingSmall,
        position: 'sticky',
        top: '56px',
        zIndex: 2,
    },
});
