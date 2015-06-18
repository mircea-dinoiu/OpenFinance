Ext.define('Financial.view.main.tabPanel.Incomes', {
    extend: 'Ext.Container',
    alias: 'widget.main-tabPanel-incomes',

    requires: [
        'Ext.SegmentedButton',
        'Financial.data.Income',
        'Ext.dataview.List'
    ],

    config: {
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
                    }
                ]
            },
            {
                xtype: 'list',
                grouped: true,
                getStore: function () { return Financial.data.Income.getStore(); },
                itemTpl: '{description}',
                initialize: function () {
                    var me = this;
                    this.callParent(arguments);
                    this.getStore().on('refresh', function () {
                        me.refresh();
                    });
                }
            }
        ]
    }
});