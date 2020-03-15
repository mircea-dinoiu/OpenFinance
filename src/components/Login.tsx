import React from 'react';
import {TextField, Toggle} from 'material-ui';
import {Button} from '@material-ui/core';
import {ButtonProgress} from 'components/loaders';
import {routes} from 'defs/routes';
import {createXHR} from 'utils/fetch';
import {ErrorSnackbar} from 'components/snackbars';
import {useDispatch} from 'react-redux';
import {setUsers} from 'state/actionCreators';
import {useTitleWithSetter, useUsers} from '../state/hooks';
import {Redirect} from 'react-router-dom';
import {paths} from 'js/defs';
import styled from 'styled-components';
import {screenQueryLarge, screenQueryMedium, screenQuerySmall} from '../defs/styles';
import {TypeUsers} from '../types';

export const Login = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [rememberMe, setRememberMe] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const dispatch = useDispatch();
    const [, setTitle] = useTitleWithSetter();
    const user = useUsers();

    React.useEffect(() => {
        setTitle('Please Login');
    }, [setTitle]);

    if (user) {
        return <Redirect to={paths.home} />;
    }

    const submit = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await createXHR<TypeUsers>({
                url: routes.user.login,
                method: 'POST',
                data: new URLSearchParams({
                    remember_me: rememberMe ? 'true' : 'false',
                    email,
                    password,
                }).toString(),
            });
            const json = response.data;

            dispatch(setUsers(json));
        } catch (e) {
            setError(e.response.data);
            setLoading(false);
        }
    };

    const handleTextFieldKeyDown = (event) => {
        switch (event.key) {
            case 'Enter':
                submit();
                break;
            default:
                setError(null);
                break;
        }
    };

    return (
        <LoginStyled>
            <div>
                <TextField
                    hintText="Type in your e-mail"
                    floatingLabelText="E-mail"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    disabled={loading}
                    fullWidth={true}
                    onKeyDown={handleTextFieldKeyDown}
                />
                <TextField
                    hintText="Type in your password"
                    floatingLabelText="Password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    disabled={loading}
                    fullWidth={true}
                    onKeyDown={handleTextFieldKeyDown}
                />
                <Toggle
                    style={{margin: '20px 0 0'}}
                    label="Remember me"
                    toggled={rememberMe}
                    onToggle={(event, toggle) => setRememberMe(toggle)}
                    disabled={loading}
                />
                <Button
                    variant="contained"
                    color="primary"
                    style={{margin: '20px 0 0'}}
                    onClick={submit}
                    disabled={loading}
                >
                    {loading ? <ButtonProgress /> : 'Login'}
                </Button>
                {error != null && <ErrorSnackbar message={error} />}
            </div>
        </LoginStyled>
    );
};

const LoginStyled = styled.div`
    display: grid;
    grid-template-columns: repeat(12, 1fr);

    > div {
        @media ${screenQuerySmall} {
            grid-column-start: 2;
            grid-column-end: 12;
        }

        @media ${screenQueryMedium} {
            grid-column-start: 4;
            grid-column-end: 10;
        }

        @media ${screenQueryLarge} {
            grid-column-start: 5;
            grid-column-end: 9;
        }
    }
`;
