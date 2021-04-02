import {Box, Button, Card, CardHeader, Checkbox, Divider, FormControlLabel, TextField} from '@material-ui/core';
import {styled} from '@material-ui/core/styles';
import {setUsers} from 'app/users/state';
import {ButtonProgress} from 'components/loaders';
import {ErrorSnackbar} from 'components/snackbars';
import {Api} from 'app/Api';
import {Bootstrap} from 'users/defs';
import {useBootstrap} from 'users/state';
import {paths} from 'js/defs';
import React from 'react';
import {useDispatch} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {createXHR} from 'app/fetch';

export const Login = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [rememberMe, setRememberMe] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const dispatch = useDispatch();
    const user = useBootstrap();

    if (user) {
        return <Redirect to={paths.home} />;
    }

    const submit = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await createXHR<Bootstrap>({
                url: Api.user.login,
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

    const handleTextFieldKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
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
        <LoginContainer>
            <LoginGrid>
                <Card>
                    <CardHeader title="Please Login" />

                    <Divider />

                    <Box p={3}>
                        <TextField
                            helperText="Type in your e-mail"
                            label="E-mail"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            disabled={loading}
                            fullWidth={true}
                            onKeyDown={handleTextFieldKeyDown}
                        />
                        <TextField
                            helperText="Type in your password"
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            disabled={loading}
                            fullWidth={true}
                            onKeyDown={handleTextFieldKeyDown}
                        />
                        <RememberMeLabel
                            control={
                                <Checkbox
                                    checked={rememberMe}
                                    onChange={(event, checked) => setRememberMe(checked)}
                                    color="primary"
                                    disabled={loading}
                                />
                            }
                            label="Remember me"
                        />
                        <LoginButton variant="contained" color="primary" onClick={submit} disabled={loading}>
                            {loading ? <ButtonProgress /> : 'Login'}
                        </LoginButton>
                        {error != null && <ErrorSnackbar message={error} />}
                    </Box>
                </Card>
            </LoginGrid>
        </LoginContainer>
    );
};

const LoginButton = styled(Button)((props) => ({
    marginTop: props.theme.spacing(3),
}));

const RememberMeLabel = styled(FormControlLabel)((props) => ({
    marginTop: props.theme.spacing(3),
}));

const LoginGrid = styled('div')((props) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    marginTop: props.theme.spacing(3),
    '& > div': {
        [props.theme.breakpoints.down('sm')]: {
            gridColumnStart: 2,
            gridColumnEnd: 12,
        },
        [props.theme.breakpoints.only('md')]: {
            gridColumnStart: 4,
            gridColumnEnd: 10,
        },
        [props.theme.breakpoints.up('lg')]: {
            gridColumnStart: 5,
            gridColumnEnd: 9,
        },
    },
}));

const LoginContainer = styled('div')(() => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
}));
