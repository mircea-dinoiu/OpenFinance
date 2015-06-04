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
            iconCls: 'icon-arrow_left',
            listeners: {
                click: 'onPreviousMonthClick'
            }
        },
        {
            itemId: 'month-picker-button',
            listeners: {
                render: 'onMonthPickerButtonRender'
            },
            iconCls: 'icon-calendar',
            menu: {
                xtype: 'menu',
                listeners: {
                    hide: 'onMonthPickerMenuHide'
                },
                items: [
                    {
                        xtype: 'monthpicker',
                        border: 0,
                        value: new Date(),
                        listeners: {
                            cancelclick: 'onMonthPickerCancel',
                            okclick: 'onMonthPickerOK'
                        }
                    }
                ]
            }
        },
        {
            iconCls: 'icon-arrow_right',
            listeners: {
                click: 'onNextMonthClick'
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
                        handler: 'onLogoutClick'
                    }
                ]
            }
        }
    ]
});