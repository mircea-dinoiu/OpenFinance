Ext.define('Financial.view.main.internal.Toolbar', {
    extend: 'Ext.toolbar.Toolbar',

    requires: 'Financial.view.main.internal.ToolbarController',

    controller: 'app-main-internal-toolbar',

    xtype: 'app-main-internal-toolbar',

    dock: 'top',

    layout: 'hbox',

    listeners: {
        afterrender: 'onAfterRender'
    },

    items: [
        {
            text: 'Exchange rates',
            iconCls: 'x-fa fa-info-circle',
            menu: {
                xtype: 'menu',
                items: [
                    {
                        xtype: 'container',
                        padding: '10px 20px',
                        itemId: 'currenciesContainer'
                    }
                ]
            }
        },
        {
            xtype: 'tbfill'
        },
        {
            iconCls: 'x-fa fa-arrow-left',
            tooltip: 'Shift back one month',
            listeners: {
                click: 'onPreviousMonthClick'
            }
        },
        {
            iconCls: 'x-fa fa-check-square-o',
            listeners: {
                click: 'onToggleStartDateButton'
            }
        },
        {
            itemId: 'start-date-button',
            listeners: {
                render: 'applyFilter'
            },
            iconCls: 'x-fa fa-calendar',
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
                        value: Financial.initialValues.getStartDate(),
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
            iconCls: 'x-fa fa-calendar',
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
                        value: Financial.initialValues.getEndDate(),
                        listeners: {
                            select: 'onDateSelect'
                        }
                    }
                ]
            }
        },
        {
            iconCls: 'x-fa fa-check-square-o',
            listeners: {
                click: 'onToggleEndDateButton'
            }
        },
        {
            iconCls: 'x-fa fa-arrow-right',
            tooltip: 'Shift forward one month',
            listeners: {
                click: 'onNextMonthClick'
            }
        },
        {
            xtype: 'tbfill'
        },
        {
            iconCls: 'x-fa fa-refresh',
            listeners: {
                click: 'applyFilter'
            }
        },
        {
            iconCls: 'x-fa fa-cog',
            menu: {
                xtype: 'menu',
                items: [
                    {
                        text: 'Manage Categories',
                        iconCls: 'x-fa fa-pencil',
                        handler: 'onManageCategoriesClick'
                    },
                    {
                        text: 'Manage Money Locations',
                        iconCls: 'x-fa fa-pencil',
                        handler: 'onManageMoneyLocationsClick'
                    }
                ]
            }
        },
        {
            listeners: {
                render: 'onUserMenuRender'
            },
            menu: {
                xtype: 'menu',
                items: [
                    {
                        iconCls: 'x-fa fa-sign-out',
                        text: 'Logout',
                        itemId: 'logout',
                        handler: 'onLogoutClick'
                    }
                ]
            }
        }
    ]
});