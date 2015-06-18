Ext.define('Financial.controller.main.tabPanel.User', {
    extend: 'Financial.controller.Abstract',

    config: {
        control: {
            logoutButton: {
                tap: 'logout'
            }
        },
        refs: {
            logoutButton: 'button[itemId="logoutButton"]',
            mainView: 'main'
        }
    },

    logout: function () {
        var me = this,
            mainView = me.getMainView();

        mainView.setMasked({
            xtype: 'loadmask',
            message: 'Logging out...'
        });

        Ext.Ajax.request({
            url: Financial.routes.user.logout,
            method: 'post',
            success: function () {
                mainView.setMasked(false);
                delete Financial.data.user;
                me.getApplication().getController('Main').show('login');
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