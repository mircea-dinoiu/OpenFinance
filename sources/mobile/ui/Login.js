// @flow
import React, {PureComponent} from 'react';
import {TextField, Toggle} from 'material-ui';
import {Button} from '@material-ui/core';
import {ButtonProgress} from './components/loaders';
import routes from 'common/defs/routes';
import {createXHR} from 'common/utils/fetch';
import {stringify} from 'query-string';
import {ErrorSnackbar} from './components/snackbars';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {updateUser} from 'common/state/actions';
import {Row, Col} from 'react-grid-system';

class Login extends PureComponent {
    state = {
        email: '',
        password: '',
        rememberMe: true,
        loading: false,
    };

    submit = async () => {
        this.setState({
            loading: true,
        });

        try {
            const response = await createXHR({
                url: routes.user.login,
                method: 'POST',
                data: stringify({
                    remember_me: this.state.rememberMe ? 'true' : null,
                    email: this.state.email,
                    password: this.state.password,
                }),
            });
            const json = response.data;

            this.props.actions.updateUser(json);
        } catch (e) {
            this.setState({
                error: e.response.data,
                loading: false,
            });
        }
    };

    handleTextFieldKeyDown = (event) => {
        switch (event.key) {
            case 'Enter':
                this.submit();
                break;
            default:
                this.setState({error: null});
                break;
        }
    };

    render() {
        return (
            <Row nogutter>
                <Col
                    xs={10}
                    md={6}
                    lg={4}
                    push={{
                        xs: 1,
                        md: 3,
                        lg: 4,
                    }}
                >
                    <TextField
                        hintText="Type in your e-mail"
                        floatingLabelText="E-mail"
                        value={this.state.email}
                        onChange={(event) =>
                            this.setState({email: event.target.value})
                        }
                        disabled={this.state.loading}
                        fullWidth={true}
                        onKeyDown={this.handleTextFieldKeyDown}
                    />
                    <TextField
                        hintText="Type in your password"
                        floatingLabelText="Password"
                        type="password"
                        value={this.state.password}
                        onChange={(event) =>
                            this.setState({password: event.target.value})
                        }
                        disabled={this.state.loading}
                        fullWidth={true}
                        onKeyDown={this.handleTextFieldKeyDown}
                    />
                    <Toggle
                        style={{margin: '20px 0 0'}}
                        label="Remember me"
                        toggled={this.state.rememberMe}
                        onToggle={(event, toggle) =>
                            this.setState({rememberMe: toggle})
                        }
                        disabled={this.state.loading}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        style={{margin: '20px 0 0'}}
                        onClick={this.submit}
                        onTouchTap={this.submit}
                        disabled={this.state.loading}
                    >
                        {this.state.loading ? <ButtonProgress /> : 'Login'}
                    </Button>
                    {this.state.error != null && (
                        <ErrorSnackbar message={this.state.error} />
                    )}
                </Col>
            </Row>
        );
    }
}

export default connect(
    null,
    (dispatch) => ({
        actions: bindActionCreators({updateUser}, dispatch),
    }),
)(Login);
