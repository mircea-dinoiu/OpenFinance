Ext.define('Financial.view.main.TabPanel', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.main-tabPanel',

    requires: [
        'Financial.view.main.tabPanel.Expenses',
        'Financial.view.main.tabPanel.User'
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
                        xtype: 'main-tabPanel-expenses'
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
                        xtype: 'main-tabPanel-user'
                    }
                ]
            }
        ]
    }
});