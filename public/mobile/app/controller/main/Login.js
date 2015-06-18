Ext.define('Financial.controller.main.Login', {
    extend: 'Ext.app.Controller',

    config: {
        control: {
            loginButton: {
                tap: 'login'
            }
        },
        refs: {
            loginButton: 'button[itemId="loginButton"]',
            loginView: 'main-login',
            emailField: 'textfield[name="email"]',
            passwordField: 'textfield[name="password"]'
        }
    },

    fieldsAreValid: function () {
        var emailField = this.getEmailField(),
            passwordField = this.getPasswordField(),
            email = emailField.getValue(),
            password = passwordField.getValue();

        if (!Financial.emailRegExp.test(email)) {
            return 'Please enter a valid email address';
        }

        if (Ext.String.trim(password).length === 0) {
            return 'Please enter your password';
        }

        return true;
    },

    login: function () {
        var me = this,
            loginView = me.getLoginView(),
            validationResult = me.fieldsAreValid();

        if (true === validationResult) {
            loginView.setMasked({
                xtype: 'loadmask',
                message: 'Logging in...'
            });

            Ext.Ajax.request({
                url: Financial.routes.user.login,
                params: loginView.getValues(),
                success: function (response) {
                    Financial.data.user = Ext.JSON.decode(response.responseText);
                    Financial.data.User.getStore().loadData(Financial.data.user.list);
                    loginView.setMasked(false);
                    Financial.app.getController('Main').launch();
                },
                failure: function (response) {
                    loginView.setMasked(false);

                    Ext.Msg.alert('Login error', Ext.JSON.decode(response.responseText), Ext.emptyFn);
                }
            });
        } else {
            Ext.Msg.alert('Login error', validationResult, Ext.emptyFn);
        }
    }
});