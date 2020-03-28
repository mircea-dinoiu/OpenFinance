import {useUsers} from 'state/hooks';
import * as React from 'react';
import {Redirect} from 'react-router-dom';
import {paths} from 'js/defs';
import {HomeLoggedIn} from 'routes/HomeLoggedIn';

export const Home = () => {
    const user = useUsers();

    if (user) {
        return <HomeLoggedIn />;
    }

    return <Redirect to={paths.login} />;
};
