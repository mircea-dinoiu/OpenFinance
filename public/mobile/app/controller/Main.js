Ext.define('Financial.controller.Main', {
    extend: 'Ext.app.Controller',

    config: {
        control: {
            logoutButton: {
                tap: 'logout'
            }
        },
        refs: {
            logoutButton: 'button[itemId="logoutButton"]',
            main: 'main'
        }
    },

    logout: function () {
        var me = this,
            mainView = me.getMain();

        mainView.setMasked({
            xtype: 'loadmask',
            message: 'Logging out...'
        });

        Ext.Ajax.request({
            url: Ext.String.format('{0}/user/logout', Financial.baseURL),
            method: 'post',
            success: function () {
                mainView.setMasked(false);
                Financial.app.launch();
            },
            failure: function () {
                mainView.setMasked(false);

                Ext.Msg.alert(
                    'Logout error',
                    'An error has occurred while trying to log you out',
                    Ext.emptyFn
                );
            }
        })
    }
});