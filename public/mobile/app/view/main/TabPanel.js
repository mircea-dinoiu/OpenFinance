Ext.define('Financial.view.main.TabPanel', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.main-tabpanel',

    requires: [
        'Financial.view.main.tabpanel.Expenses',
        'Financial.view.main.tabpanel.User'
    ],

    config: {
        ui: 'light',
        tabBar: {
            layout: {
                pack: 'center',
                align: 'center'
            },
            docked: 'bottom'
        },
        items: [
            {
                title: 'Reports',
                iconCls: 'info',
                cls: 'card'
            },
            {
                title: 'Expenses',
                iconCls: 'organize',
                cls: 'card',
                items: [
                    {
                        xtype: 'main-tabpanel-expenses'
                    }
                ]
            },
            {
                title: 'Incomes',
                cls: 'card',
                iconCls: 'organize'
            },
            {
                title: 'Settings',
                cls: 'card',
                iconCls: 'settings'
            },
            {
                title: 'User',
                cls: 'card',
                iconCls: 'user',
                items: [
                    {
                        xtype: 'main-tabpanel-user'
                    }
                ]
            }
        ]
    }
});