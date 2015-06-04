/**
 * The main application class. An instance of this class is created by app.js when it calls
 * Ext.application(). This is the ideal place to handle application launch and initialization
 * details.
 */
Ext.define('Financial.Application', {
    extend: 'Ext.app.Application',

    name: 'Financial',

    stores: [
        'Financial.store.Expense',
        'Financial.store.User',
        'Financial.store.Currency',
        'Financial.store.Category'
    ],

    models: [
        'Financial.model.Expense',
        'Financial.model.User',
        'Financial.model.Currency',
        'Financial.model.Category'
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
            var requestsPending = 0;

            function checkRequestsState() {
                requestsPending--;

                if (requestsPending === 0) {
                    me.show('internal');
                }
            }

            Ext.each([
                    {
                        success: function (response) {
                            me.setCurrency(response);
                        },
                        url: Financial.routes.getCurrencies
                    },
                    {
                        success: function (response) {
                            var list = Ext.JSON.decode(response.responseText);

                            Financial.data.category = {
                                list: list,
                                store: Ext.create('Financial.store.Category', {
                                    data: list
                                })
                            };
                        },
                        url: Financial.routes.category.list
                    }
                ],
                function (request) {
                    requestsPending++;

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
                    Financial.data.user.store = Ext.create('Financial.store.User', {
                        data: Financial.data.user.list
                    });

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
    },

    setCurrency: function (response) {
        Financial.data.currency = Ext.JSON.decode(response.responseText);

        Financial.data.currency.store = Ext.create('Financial.store.Currency', {
            data: Ext.Object.getValues(Financial.data.currency.map)
        });
    }
});
