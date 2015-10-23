Ext.define('Financial.controller.Abstract', {
    extend: 'Ext.app.Controller',

    subControllers: [],

    initSubControllers: function () {
        var me = this,
            subControllers = me.subControllers;

        if (!Ext.isArray(subControllers)) {
            subControllers = [subControllers];
        }

        Ext.require(
            subControllers,
            function () {
                Ext.each(subControllers, function (subController) {
                    Ext.create(subController, {
                        application: me.getApplication()
                    }).init();
                });
            }
        );
    },

    init: function () {
        this.initSubControllers();
    }
});