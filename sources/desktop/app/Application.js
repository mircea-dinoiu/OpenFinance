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
        'Financial.data.MoneyLocation',

        'Financial.util.Format',
        'Financial.util.Misc',
        'Financial.util.Events',

        'Financial.base.GridViewController',

        'Financial.ux.window.Notification'
    ],

    stores: [
        'Financial.store.ExpenseStore',
        'Financial.store.IncomeStore',
        'Financial.store.UserStore',
        'Financial.store.CurrencyStore',
        'Financial.store.CategoryStore',
        'Financial.store.MoneyLocationStore',
        'Financial.store.data.ReportStore'
    ],

    models: [
        'Financial.model.ExpenseModel',
        'Financial.model.IncomeModel',
        'Financial.model.UserModel',
        'Financial.model.CurrencyModel',
        'Financial.model.CategoryModel',
        'Financial.model.MoneyLocationModel',
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
        })
    },

    getInitialRequests: function () {
        return [
            {
                success: function (response) {
                    Financial.data.Currency.setCurrency(response);
                },
                url: Financial.routes.getCurrencies
            },
            {
                success: function (response) {
                    var expenses = Ext.JSON.decode(response.responseText);

                    if (expenses.length) {
                        Ext.create('widget.uxNotification', {
                            position: 'tr',
                            useXAxis: true,
                            iconCls: 'x-fa fa-exclamation-triangle',
                            title: 'Notice',
                            html: 'There are <strong>{0}</strong> pending expenses before {1}'.format(
                                expenses.length,
                                Ext.Date.format(Financial.initialValues.getStartDate(), 'j, F Y')
                            ),
                            slideInDuration: 800,
                            slideBackDuration: 1500,
                            autoCloseDelay: 5000,
                            slideInAnimation: 'elasticIn',
                            slideBackAnimation: 'elasticIn'
                        }).show();
                    }
                },
                url: (function () {
                    var url = Financial.routes.expense.list,
                        params = {
                            end_date: Ext.Date.format(Financial.initialValues.getStartDate(), 'Y-m-d'),
                            'filters[status]': 'pending'
                        };

                    Ext.Object.each(params, function (key, value) {
                        url = Ext.String.urlAppend(url, [key, value].join('='));
                    });

                    return url;
                }())
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

            requestsPending += 2;
            Financial.data.Category.getStore().load(checkRequestsState);
            Financial.data.MoneyLocation.getStore().load(checkRequestsState);

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

        appMain.removeAll();
        appMain.add({
            xtype: Ext.String.format('app-main-{0}', view)
        });

        appMain.setLoading(false);
    }
});
