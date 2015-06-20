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
            iconCls: 'icon-date_previous',
            tooltip: 'Shift back one month',
            listeners: {
                click: 'onPreviousMonthClick'
            }
        },
        {
            iconCls: 'icon-checkbox_checked',
            listeners: {
                click: 'onToggleStartDateButton'
            }
        },
        {
            itemId: 'start-date-button',
            listeners: {
                render: 'applyFilter'
            },
            iconCls: 'icon-calendar',
            menu: {
                xtype: 'menu',
                listeners: {
                    hide: 'onDatePickerHide'
                },
                items: [
                    {
                        xtype: 'datepicker',
                        border: 0,
                        startDay: 1,
                        value: (function () {
                            var date = new Date();

                            date.setDate(1);

                            return date;
                        }()),
                        listeners: {
                            select: 'onDateSelect'
                        }
                    }
                ]
            }
        },
        {
            xtype: 'tbtext',
            html: '&mdash;'
        },
        {
            itemId: 'end-date-button',
            listeners: {
                render: 'applyFilter'
            },
            iconCls: 'icon-calendar',
            menu: {
                xtype: 'menu',
                listeners: {
                    hide: 'onDatePickerHide'
                },
                items: [
                    {
                        xtype: 'datepicker',
                        border: 0,
                        startDay: 1,
                        value: (function () {
                            var date = new Date();

                            date.setMonth(date.getMonth() + 1);
                            date.setDate(0);

                            return date;
                        }()),
                        listeners: {
                            select: 'onDateSelect'
                        }
                    }
                ]
            }
        },
        {
            iconCls: 'icon-checkbox_checked',
            listeners: {
                click: 'onToggleEndDateButton'
            }
        },
        {
            iconCls: 'icon-date_next',
            tooltip: 'Shift forward one month',
            listeners: {
                click: 'onNextMonthClick'
            }
        },
        {
            xtype: 'tbfill'
        },
        {
            iconCls: 'icon-database_refresh',
            listeners: {
                click: 'applyFilter'
            }
        },
        {
            iconCls: 'icon-cog',
            menu: {
                xtype: 'menu',
                items: [
                    {
                        text: 'Manage Categories',
                        iconCls: 'icon-folder_edit',
                        handler: 'onManageCategoriesClick'
                    }
                ]
            }
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