Ext.define('Financial.view.main.Login', {
    extend: 'Ext.container.Container',

    requires: 'Financial.view.main.LoginController',

    xtype: 'app-main-login',

    controller: 'app-main-login',

    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'
    },

    flex: 1,

    width: '100%',

    items: [
        {
            xtype: 'form',
            title: 'Login',

            layout: 'anchor',
            defaults: {
                anchor: '100%',
                padding: '5px 20px',
                xtype: 'textfield'
            },

            items: [
                {
                    fieldLabel: 'E-mail',
                    vtype: 'email',
                    name: 'email',
                    allowBlank: false,
                    padding: '20px 20px 5px 20px'
                },
                {
                    fieldLabel: 'Password',
                    name: 'password',
                    allowBlank: false,
                    inputType: 'password'
                },
                {
                    xtype: 'checkbox',
                    fieldLabel: 'Remember me',
                    name: 'remember_me',
                    inputValue: true,
                    inputType: 'checkbox',
                    padding: '5px 20px 20px 20px'
                }
            ],

            buttonAlign: 'center',
            buttons: [
                {
                    text: 'Login',
                    formBind: true, //only enabled once the form is valid
                    disabled: true,
                    handler: 'submitLogin',
                    iconCls: 'icon-door_in'
                }
            ]
        }

    ]
});
