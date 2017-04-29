Ext.define('Financial.view.main.Internal', {
    extend: 'Ext.container.Container',

    requires: [
        'Financial.view.main.InternalController',
        'Financial.view.main.internal.Data',
        'Financial.view.main.internal.Charts',
        'Financial.view.main.internal.Toolbar'
    ],

    xtype: 'app-main-internal',
    controller: 'app-main-internal',

    width: '100%',
    flex: 1,

    layout: 'vbox',

    defaults: {
        width: '100%'
    },

    listeners: {
        afterrender: 'onAfterRender'
    },

    items: [
        {
            xtype: 'app-main-internal-toolbar'
        },
        {
            layout: 'fit',
            style: {
                opacity: Financial.util.Discreteness.toOpacity()
            },
            xtype: 'tabpanel',
            defaults: {
                margin: '1px 0 0 0'
            },
            items: [
                {
                    title: 'Data',
                    xtype: 'app-main-internal-data'
                },
                {
                    title: 'Charts',
                    xtype: 'app-main-internal-charts'
                }
            ],
            flex: 1,
            margin: '10px 0 0 0',
            listeners: {
                tabchange: 'onTabChange'
            }
        }
    ]
});