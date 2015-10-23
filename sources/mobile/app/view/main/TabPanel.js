Ext.define('Financial.view.main.TabPanel', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.main-tabPanel',

    requires: [
        'Financial.util.Format',
        'Financial.view.main.tabPanel.Expenses',
        'Financial.view.main.tabPanel.Incomes',
        'Financial.view.main.tabPanel.User'
    ],

    config: {
        tabBar: {
            layout: {
                pack: 'center',
                align: 'center'
            },
            docked: 'bottom'
        },
        defaults: {
            cls: 'card',
            layout: 'vbox',
            defaults: {
                flex: 1
            }
        },
        items: [
            {
                title: 'Reports',
                iconCls: 'info'
            },
            {
                title: 'Expenses',
                iconCls: 'organize',
                items: [
                    {
                        xtype: 'main-tabPanel-expenses'
                    }
                ]
            },
            {
                title: 'Incomes',
                iconCls: 'organize',
                items: [
                    {
                        xtype: 'main-tabPanel-incomes'
                    }
                ]
            },
            {
                title: 'Settings',
                iconCls: 'settings'
            },
            {
                title: 'User',
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