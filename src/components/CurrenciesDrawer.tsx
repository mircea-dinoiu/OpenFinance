import {CurrenciesDrawerContent} from 'components/CurrenciesDrawerContent';
import {Drawer} from '@material-ui/core';
import React from 'react';
import {useCurrenciesDrawerOpenWithActions} from 'state/currencies';

export const CurrenciesDrawer = () => {
    const [
        currenciesDrawerOpen,
        {setCurrenciesDrawerOpen},
    ] = useCurrenciesDrawerOpenWithActions();

    return (
        <Drawer
            anchor="right"
            open={currenciesDrawerOpen}
            onClose={() => setCurrenciesDrawerOpen(false)}
        >
            <CurrenciesDrawerContent />
        </Drawer>
    );
};
