import {Paper, Tab, Tabs} from '@material-ui/core';
import {Accounts} from 'components/accounts/Accounts';
import {AccountTypes} from 'components/accountTypes/AccountTypes';
import {Categories} from 'components/categories/Categories';
import {TransactionsSummaryCombo} from 'components/transactions/TransactionsSummaryCombo';
import {spacingSmall} from 'defs/styles';
import {paths} from 'js/defs';
import * as React from 'react';
import {Route, useHistory, useLocation} from 'react-router-dom';
import {useScreenSize} from 'state/hooks';
import {useSelectedProject} from 'state/projects';
import {makeUrl} from 'utils/url';

export const AppTabs = () => {
    const history = useHistory();
    const location = useLocation();
    const project = useSelectedProject();
    const tabs = [
        paths.transactions,
        paths.categories,
        paths.accounts,
        paths.accountTypes,
    ];
    const screenSize = useScreenSize();

    return (
        <div style={{margin: screenSize.isLarge ? spacingSmall : 0}}>
            {screenSize.isLarge && (
                <Paper style={{marginBottom: spacingSmall}}>
                    <Tabs
                        value={tabs.indexOf(location.pathname)}
                        onChange={(event, index) => {
                            history.push(
                                makeUrl(tabs[index], {projectId: project.id}),
                            );
                        }}
                    >
                        <Tab label="Transactions" />
                        <Tab label="Categories" />
                        <Tab label="Accounts" />
                        <Tab label="Account Types" />
                    </Tabs>
                </Paper>
            )}
            <Route
                path={paths.transactions}
                component={TransactionsSummaryCombo}
            />
            <Route path={paths.categories} component={Categories} />
            <Route path={paths.accounts} component={Accounts} />
            <Route path={paths.accountTypes} component={AccountTypes} />
        </div>
    );
};
