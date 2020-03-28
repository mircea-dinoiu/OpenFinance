import React from 'react';
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    Paper,
} from '@material-ui/core';
import {useMoneyLocations, useMoneyLocationTypes} from 'state/hooks';
import {useCurrencies} from 'state/currencies';

export const Accounts = () => {
    const rows = useMoneyLocations();
    const currencies = useCurrencies();
    const types = useMoneyLocationTypes();

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Currency</TableCell>
                        <TableCell>Type</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((r) => (
                        <TableRow key={r.id}>
                            <TableCell>{r.id}</TableCell>
                            <TableCell>{r.name}</TableCell>
                            <TableCell>{r.status}</TableCell>
                            <TableCell>
                                {
                                    Object.values(currencies).find(
                                        (c) => c.id === r.currency_id,
                                    ).iso_code
                                }
                            </TableCell>
                            <TableCell>
                                {
                                    Object.values(types).find(
                                        (t) => t.id === r.type_id,
                                    ).name
                                }
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
