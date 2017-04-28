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
            xtype: 'tbfill',
        },
        {
            html: 'Got issues with the new site? <a href="' + Financial.oldSite + '">Switch to legacy version</a>',
            xtype: 'container',
            style: {
                background: '#ffde71',
                height: '32px',
                top: '0',
                border: '1px solid #BD9927',
                lineHeight: '30px',
                padding: '0 8px'
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
            xtype: 'slider',
            width: 200,
            value: Financial.util.Discreteness.getValue(),
            increment: 10,
            labelWidth: 80,
            minValue: 0,
            maxValue: 100,
            fieldLabel: 'Discreteness',
            tipText: function (thumb) {
                return Ext.String.format('{0}%', thumb.value);
            },
            listeners: {
                change: 'onDiscretenessChange'
            }
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
                        handler: 'onManageMLsClick'
                    },
                    {
                        text: 'Manage Money Location Types',
                        iconCls: 'x-fa fa-pencil',
                        handler: 'onManageMLTypesClick'
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