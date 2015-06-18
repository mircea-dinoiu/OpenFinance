Ext.define('Financial.view.main.tabPanel.Expenses', {
    extend: 'Ext.Container',
    alias: 'widget.main-tabPanel-expenses',

    requires: [
        'Ext.SegmentedButton',
        'Financial.data.Expense',
        'Ext.dataview.List'
    ],

    config: {
        layout: 'fit',
        items: [
            {
                layout: {
                    type: 'hbox',
                    pack: 'center'
                },
                xtype: 'toolbar',
                docked: 'top',
                items: [
                    {
                        iconCls: 'add'
                    },
                    /*{
                        iconCls: 'compose'
                    },
                    {
                        iconCls: 'delete'
                    },
                    {
                        iconCls: 'refresh'
                    },
                    {
                        iconCls: 'search'
                    }*/
                ]
            },
            {
                xtype: 'list',
                grouped: true,
                getStore: function () { return Financial.data.Expense.getStore(); },
                itemTpl: '{item}',
                initialize: function () {
                    var me = this;
                    this.callParent(arguments);
                    this.getStore().on('refresh', function () {
                        me.refresh();
                    });
                }
            },
            /*{
                layout: {
                    type: 'hbox',
                    pack: 'center'
                },
                xtype: 'toolbar',
                docked: 'top',
                items: [
                    {
                        xtype: 'segmentedbutton',
                        items: [
                            {
                                text: 'Finished',
                                pressed: true
                            },
                            {
                                text: 'Pending'
                            },
                            {
                                text: 'All'
                            }
                        ]
                    }
                ]
            }*/
        ]
    }
});