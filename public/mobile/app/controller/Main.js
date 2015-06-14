Ext.define('Financial.controller.Main', {
    extend: 'Financial.controller.Abstract',

    subControllers: [
        'Financial.controller.main.Login',
        'Financial.controller.main.TabPanel'
    ],

    config: {
        refs: {
            mainView: 'main'
        }
    },

    launch: function () {
        var me = this,
            mainView = me.getMainView();

        if (Financial.data.user) {
            me.show('tabPanel');
        } else {
            mainView.setMasked({
                xtype: 'loadmask'
            });

            Ext.Ajax.request({
                url: Financial.routes.user.list,
                success: function (response) {
                    Financial.data.user = Ext.JSON.decode(response.responseText);

                    mainView.setMasked(false);
                    me.show('tabPanel');
                },
                failure: function () {
                    mainView.setMasked(false);
                    me.show('login');
                }
            });
        }
    },

    show: function (item) {
        var mainView = this.getMainView();

        mainView.removeAll();
        mainView.add({
            xtype: Ext.String.format('main-{0}', item)
        });
    }
});