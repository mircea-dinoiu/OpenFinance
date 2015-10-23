/**
 * The main application class. An instance of this class is created by app.js when it calls
 * Ext.application(). This is the ideal place to handle application launch and initialization
 * details.
 */
Ext.define('Financial.Application', {
    extend: 'Ext.app.Application',

    name: 'Financial',

    requires: [
        'Financial.data.User',
        'Financial.data.Currency',
        'Financial.data.Category',
        'Financial.util.Format',
        'Financial.util.Misc',

        'Financial.base.GridViewController'
    ],

    stores: [
        'Financial.store.Expense',
        'Financial.store.Income',
        'Financial.store.User',
        'Financial.store.Currency',
        'Financial.store.Category',
        'Financial.store.data.Report'
    ],

    models: [
        'Financial.model.Expense',
        'Financial.model.Income',
        'Financial.model.User',
        'Financial.model.Currency',
        'Financial.model.Category',
        'Financial.model.data.Report'
    ],

    controllers: [
        'Financial.controller.Data'
    ],

    views: [
        'Financial.view.main.Login',
        'Financial.view.main.Internal'
    ],

    config: {
        refs: {
            appMain: 'app-main'
        }
    },

    launch: function () {
        var me = this,
            appMain = me.getAppMain();

        appMain.setLoading(true);

        if (Financial.data.user) {
            var requestsPending = 2;

            function checkRequestsState() {
                requestsPending--;

                if (requestsPending === 0) {
                    me.show('internal');
                }
            }

            Financial.data.Category.getStore().load(checkRequestsState);

            Ext.each([
                    {
                        success: function (response) {
                            Financial.data.Currency.setCurrency(response);
                        },
                        url: Financial.routes.getCurrencies
                    }
                ],
                function (request) {
                    Ext.Ajax.request({
                        url: request.url,
                        success: function () {
                            request.success.apply(request, arguments);

                            checkRequestsState();
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
                }
            );
        } else {
            Ext.Ajax.request({
                url: Financial.routes.user.list,
                success: function (response) {
                    Financial.data.user = Ext.JSON.decode(response.responseText);
                    Financial.data.User.getStore().loadData(Financial.data.user.list);

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
