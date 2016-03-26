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
        'Financial.data.ML',
        'Financial.data.MLType',
        'Financial.data.Income',
        'Financial.data.Expense',

        'Financial.util.Format',
        'Financial.util.Misc',
        'Financial.util.Events',

        'Financial.base.GridViewController'
    ],

    stores: [
        'Financial.store.ExpenseStore',
        'Financial.store.IncomeStore',
        'Financial.store.UserStore',
        'Financial.store.CurrencyStore',
        'Financial.store.CategoryStore',
        'Financial.store.MLStore',
        'Financial.store.MLTypeStore',
        'Financial.store.data.ReportStore'
    ],

    models: [
        'Financial.model.ExpenseModel',
        'Financial.model.IncomeModel',
        'Financial.model.UserModel',
        'Financial.model.CurrencyModel',
        'Financial.model.CategoryModel',
        'Financial.model.MLModel',
        'Financial.model.MLTypeModel',
        'Financial.model.data.ReportModel'
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

    initAjaxHandlers: function () {
        var me = this,
            csrfToken = Ext.select('meta[name="csrf-token"]').elements[0].getAttribute('content');

        Ext.Ajax.on('beforerequest', function (o, r) {
            r.headers = Ext.apply({
                'Accept': 'application/json',
                'X-CSRF-Token': csrfToken
            }, r.headers || {});
        });

        Ext.Ajax.on('requestexception', function (conn, response, opts) {
            if (!opts.failure) {
                Ext.Msg.show({
                    title: 'Error',
                    closable: false,
                    draggable: false,
                    message: response.responseText || 'Cannot connect to server.',
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR,
                    fn: function () {
                        me.getAppMain().setLoading(true);
                        window.location.reload();
                    }
                });
            }
        });
    },

    getInitialRequests: function () {
        return [
            {
                success: function (response) {
                    Financial.data.Currency.setCurrency(response);
                },
                url: Financial.routes.getCurrencies
            }
        ];
    },

    launch: function () {
        var me = this,
            appMain = me.getAppMain();

        me.initAjaxHandlers();

        appMain.setLoading(true);

        if (Financial.data.user) {
            var initialRequests = me.getInitialRequests(),
                requestsPending = initialRequests.length;

            function checkRequestsState() {
                requestsPending--;

                if (requestsPending === 0) {
                    me.show('internal');
                }
            }

            var storesToPreload = [
                Financial.data.Category.getStore(),
                Financial.data.ML.getStore(),
                Financial.data.MLType.getStore()
            ];

            requestsPending += storesToPreload.length;

            storesToPreload.forEach(function (store) {
                store.load(checkRequestsState);
            });

            Ext.each(initialRequests,
                function (request) {
                    Ext.Ajax.request(Ext.apply({}, {
                        success: function () {
                            request.success.apply(request, arguments);

                            checkRequestsState();
                        },
                        failure: function () {
                            Ext.Msg.show({
                                message: 'There was an error while trying to fetch data.<br>Please come back later.',
                                title: 'Error',
                                closable: false,
                                draggable: false
                            });
                        }
                    }, request));
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

        appMain.removeAll(); // also removes loading mask
        appMain.add({
            xtype: Ext.String.format('app-main-{0}', view)
        });
    }
});
