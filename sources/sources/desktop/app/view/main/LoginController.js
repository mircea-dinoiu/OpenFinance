Ext.define('Financial.view.main.LoginController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.app-main-login',

    submitLogin: function () {
        var me = this,
            view = me.getView(),
            form = view.down('form');

        view.setLoading('Logging in...');

        Ext.Ajax.request({
            url: Financial.routes.user.login,
            params: form.getValues(),
            success: function (response) {
                Financial.data.user = Ext.JSON.decode(response.responseText);
                Financial.data.User.getStore().loadData(Financial.data.user.list);

                view.setLoading(false);
                Financial.app.launch()
            },
            failure: function (response) {
                view.setLoading(false);

                Ext.Msg.alert('Login error', Ext.JSON.decode(response.responseText), Ext.emptyFn);
            }
        });
    }
});