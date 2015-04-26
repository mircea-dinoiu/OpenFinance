Ext.define('Financial.view.main.tabPanel.User', {
    extend: 'Ext.Panel',
    alias: 'widget.main-tabPanel-user',

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