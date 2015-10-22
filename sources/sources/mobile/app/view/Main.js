Ext.define('Financial.view.Main', {
    extend: 'Ext.Container',

    alias: 'widget.main',

    requires: [
        'Financial.view.main.TabPanel',
        'Financial.view.main.Login'
    ],

    config: {
        layout: 'vbox',
        defaults: {
            flex: 1
        }
    }
});
