Ext.define('Financial.view.Login', {
    extend: 'Ext.form.Panel',
    alias: 'widget.loginview',

    requires: [
        'Ext.form.FieldSet',
        'Ext.field.Password'
    ],
    
    config: {
        title: 'Login',
        padding: '0 50',
        layout: {
            type: 'vbox',
            pack: 'center'
        },
        items: [
            {
                xtype: 'fieldset',
                items: [
                    {
                        xtype: 'textfield',
                        placeHolder: 'E-mail',
                        name: 'email',
                        padding: '0 0 0 10'
                    },
                    {
                        xtype: 'passwordfield',
                        placeHolder: 'Password',
                        name: 'password',
                        padding: '0 0 0 10'
                    },
                    {
                        xtype: 'checkboxfield',
                        name: 'remember_me',
                        value: true,
                        label: 'Remember me',
                        labelWidth: '70%'
                    }
                ]
            },
            /*{
                xtype: 'togglefield',
                name: 'remember_me',
                label: 'Remember me',
                labelWidth: '90%'
            },
            /*
            {
                /*xtype: 'checkboxfield',
                name: 'remember_me',
                value: true,
                label: 'Remember me',
                labelWrap: true,
                margin: '0 0 0 0'
            },*/
            {
                xtype: 'button',
                itemId: 'loginButton',
                ui: 'action',
                text: 'Login',
                margin: '10 0 0 0'
            }
        ]
    }
});