Ext.define('Financial.controller.Main', {
    extend: 'Financial.controller.Abstract',

    subControllers: [
        'Financial.controller.main.Login',
        'Financial.controller.main.TabPanel'
    ],

    requires: [
        'Financial.data.Currency',
        'Financial.data.User',
        'Financial.data.Category'
    ],

    config: {
        refs: {
            mainView: 'main'
        }
    },

    launch: function () {
        var me = this,
            mainView = me.getMainView();

        mainView.setMasked({
            xtype: 'loadmask'
        });

        if (Financial.data.user) {
            var requestsPending = 2;

            function checkRequestsState() {
                requestsPending--;

                if (requestsPending === 0) {
                    me.show('tabPanel');
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
                        failure: function () {
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
                    Financial.data.User.getStore().setData(Financial.data.user.list);

                    me.launch();
                },
                failure: function () {
                    me.show('login');
                }
            });
        }
    },

    show: function (item) {
        var mainView = this.getMainView();

        mainView.setMasked(false);
        mainView.removeAll();
        mainView.add({
            xtype: Ext.String.format('main-{0}', item)
        });
    }
});