Ext.define('Financial.view.main.internal.Toolbar', {
    extend: 'Ext.toolbar.Toolbar',

    requires: 'Financial.view.main.internal.ToolbarController',

    controller: 'app-main-internal-toolbar',

    xtype: 'app-main-internal-toolbar',

    dock: 'top',
    
    layout: 'hbox',

    items: [
        {
            xtype: 'tbtext',
            listeners: {
                render: 'onCurrencyRender'
            }
        },
        {
            xtype: 'tbfill'
        },
        {
            listeners: {
                render: 'onSelectMonthButtonRender'
            },
            iconCls: 'icon-calendar',
            menu: {
                xtype: 'menu',
                items: [
                    {
                        xtype: 'monthpicker',
                        border: 0,
                        value: new Date(),
                        listeners: {
                            cancelclick: 'onMonthPickerCancel',
                            okclick: 'onMonthPickerOK',
                            hide: 'onMonthPickerHide'
                        }
                    }
                ]
            }
        },
        {
            xtype: 'tbfill'
        },
        {
            iconCls: 'icon-user',
            listeners: {
                render: 'onUserMenuRender'
            },
            menu: {
                xtype: 'menu',
                items: [
                    {
                        iconCls: 'icon-door_out',
                        text: 'Logout',
                        itemId: 'logout',
                        handler: 'doLogout'
                    }
                ]
            }
        }
    ]
});