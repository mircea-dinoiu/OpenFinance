Ext.define('Financial.view.main.tabpanel.User', {
    extend: 'Ext.Container',
    alias: 'widget.main-tabpanel-user',

    config: {
        items: [
            {
                xtype: 'button',
                ui: 'decline',
                text: 'Logout',
                itemId: 'logoutButton',
                margin: '10 15'
            }
        ]
    }
});