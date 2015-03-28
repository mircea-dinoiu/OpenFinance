Ext.define('Financial.view.Main', {
    extend: 'Ext.Container',
    alias: 'widget.main',

    requires: [
        'Financial.view.main.TabPanel'
    ],

    config: {
        layout: 'vbox',
        items: [
            {
                xtype: 'main-tabpanel',
                flex: 1
            }
        ]
    }
});
