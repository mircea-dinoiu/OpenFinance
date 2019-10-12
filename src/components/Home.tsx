import {useTitleWithSetter, useUsers} from '../state/hooks';
import * as React from 'react';
import {Redirect} from 'react-router-dom';
import {paths} from 'js/defs';
import Dashboard from './Dashboard';

export const Home = () => {
    const user = useUsers();
    const [, setTitle] = useTitleWithSetter();

    React.useEffect(() => {
        setTitle('Financial');
    }, []);

    if (user) {
        return <Dashboard />;
    }

    return <Redirect to={paths.login} />;
};
