Ext.define('Financial.controller.Login', {
    extend: 'Ext.app.Controller',

    config: {
        control: {
            loginButton: {
                tap: 'login'
            }
        },
        refs: {
            loginButton: 'button[itemId="loginButton"]',
            loginView: 'loginview',
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
                xtype: 'loadmask'
            });

            Ext.Ajax.request({
                url: Ext.String.format('{0}/user/login', Financial.baseURL),
                params: loginView.getValues(),
                success: function () {
                    loginView.setMasked(false);
                    Financial.app.launch();
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