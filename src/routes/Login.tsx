import React from 'react';
import {Button, TextField, Checkbox, FormControlLabel, Card, CardHeader, Divider} from '@material-ui/core';
import {ButtonProgress} from 'components/loaders';
import {Api} from 'defs/Api';
import {createXHR} from 'utils/fetch';
import {ErrorSnackbar} from 'components/snackbars';
import {useDispatch} from 'react-redux';
import {setUsers} from 'state/actionCreators';
import {useBootstrap} from 'state/hooks';
import {Redirect} from 'react-router-dom';
import {paths} from 'js/defs';
import {styled, makeStyles} from '@material-ui/core/styles';
import {screenQueryLarge, screenQueryMedium, screenQuerySmall, spacingLarge} from 'defs/styles';
import {Bootstrap} from 'types';

const useStyles = makeStyles({
    rememberMe: {
        marginTop: spacingLarge,
    },
});

export const Login = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [rememberMe, setRememberMe] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const dispatch = useDispatch();
    const user = useBootstrap();
    const cls = useStyles();

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
        <LoginStyled>
            <Card>
                <CardHeader title="Please Login" />

                <Divider />

                <div
                    style={{
                        padding: spacingLarge,
                    }}
                >
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
                    <FormControlLabel
                        className={cls.rememberMe}
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
            </Card>
        </LoginStyled>
    );
};

const LoginStyled = styled('div')({
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    marginTop: spacingLarge,
    '& > div': {
        [`@media ${screenQuerySmall}`]: {
            gridColumnStart: 2,
            gridColumnEnd: 12,
        },
        [`@media ${screenQueryMedium}`]: {
            gridColumnStart: 4,
            gridColumnEnd: 10,
        },
        [`@media ${screenQueryLarge}`]: {
            gridColumnStart: 5,
            gridColumnEnd: 9,
        },
    },
});
