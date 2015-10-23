Ext.define('Financial.controller.main.TabPanel', {
    extend: 'Financial.controller.Abstract',

    subControllers: 'Financial.controller.main.tabPanel.User',

    config: {
        control: {
            tabPanel: {
                activate: 'onActivate'
            }
        },
        refs: {
            tabPanel: 'main-tabPanel',
            mainView: 'main'
        }
    },

    onActivate: function () {
        var me = this,
            mainView = me.getMainView(),
            requestsPending = 2;

        mainView.setMasked({
            xtype: 'loadmask'
        });

        function checkRequestsState() {
            requestsPending--;

            if (requestsPending === 0) {
                mainView.setMasked(false);
            }
        }

        Financial.data.Expense.getStore().load(checkRequestsState);
        Financial.data.Income.getStore().load(checkRequestsState);
    }
});