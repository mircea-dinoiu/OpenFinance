Ext.define('Financial.view.main.Internal', {
    extend: 'Ext.container.Container',

    requires: [
        'Financial.view.main.internal.Data',
        'Financial.view.main.internal.Toolbar'
    ],

    xtype: 'app-main-internal',

    width: '100%',
    flex: 1,

    layout: 'vbox',

    defaults: {
        width: '100%'
    },

    items: [
        {
            xtype: 'app-main-internal-toolbar'
        },
        {
            layout: 'fit',
            items: [
                {
                    xtype: 'app-main-internal-data'
                }
            ],
            flex: 1,
            margin: '10px 0 0 0'
        }
    ]
});