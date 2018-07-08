// @flow
import React, { PureComponent } from 'react';
import { TextField, Toggle, RaisedButton } from 'material-ui';
import { ButtonProgress } from './components/loaders';
import routes from 'common/defs/routes';
import fetch from 'common/utils/fetch';
import { stringify } from 'query-string';
import { ErrorSnackbar } from './components/snackbars';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateUser } from 'common/state/actions';
import { Row, Col } from 'react-grid-system';

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

        const response = await fetch(routes.user.login, {
            method: 'POST',
            body: stringify({
                remember_me: this.state.rememberMe ? 'true' : null,
                email: this.state.email,
                password: this.state.password,
            }),
        });
        const json = await response.json();

        if (response.ok) {
            this.props.actions.updateUser(json);
        } else {
            this.setState({
                error: json,
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
                this.setState({ error: null });
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
                            this.setState({ email: event.target.value })
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
                            this.setState({ password: event.target.value })
                        }
                        disabled={this.state.loading}
                        fullWidth={true}
                        onKeyDown={this.handleTextFieldKeyDown}
                    />
                    <Toggle
                        style={{ margin: '20px 0 0' }}
                        label="Remember me"
                        toggled={this.state.rememberMe}
                        onToggle={(event, toggle) =>
                            this.setState({ rememberMe: toggle })
                        }
                        disabled={this.state.loading}
                    />
                    <RaisedButton
                        label={
                            this.state.loading ? <ButtonProgress /> : 'Login'
                        }
                        primary={true}
                        style={{ margin: '20px 0 0' }}
                        onClick={this.submit}
                        onTouchTap={this.submit}
                        disabled={this.state.loading}
                    />
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
        actions: bindActionCreators({ updateUser }, dispatch),
    }),
)(Login);
