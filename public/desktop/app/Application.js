/**
 * The main application class. An instance of this class is created by app.js when it calls
 * Ext.application(). This is the ideal place to handle application launch and initialization
 * details.
 */
Ext.define('Financial.Application', {
    extend: 'Ext.app.Application',
    
    name: 'Financial',

    stores: [
        // TODO: add global / shared stores here
    ],

    config: {
        refs: {
            appMain: 'app-main'
        }
    },

    requires: [
        'Financial.view.main.Login',
        'Financial.view.main.Internal'
    ],
    
    launch: function () {
        var me = this,
            appMain = me.getAppMain();

        appMain.setLoading(true);

        if (Financial.data.user) {
            Ext.Ajax.request({
                url: Ext.String.format('{0}/get-currencies', Financial.baseURL),
                success: function (response) {
                    Financial.data.currency = Ext.JSON.decode(response.responseText);

                    me.show('internal');
                },
                error: function () {
                    Ext.Msg.show({
                        message: 'There was an error while trying to fetch data.<br>Please come back later.',
                        title: 'Error',
                        closable: false,
                        draggable: false
                    });
                }
            });

        } else {
            Ext.Ajax.request({
                url: Ext.String.format('{0}/user/read', Financial.baseURL),
                success: function (response) {
                    Financial.data.user = Ext.JSON.decode(response.responseText);

                    Financial.app.launch();
                },
                failure: function () {
                    me.show('login');
                }
            });
        }
    },

    show: function (view) {
        var appMain = this.getAppMain();

        appMain.removeAll();
        appMain.add({
            xtype: Ext.String.format('app-main-{0}', view)
        });

        appMain.setLoading(false);
    }
});
