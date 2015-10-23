Ext.define('Financial.view.main.tabPanel.Incomes', {
    extend: 'Ext.Container',
    alias: 'widget.main-tabPanel-incomes',

    requires: [
        'Ext.SegmentedButton',
        'Financial.data.Income',
        'Ext.dataview.List'
    ],

    config: {
        layout: 'vbox',
        defaults: {
            flex: 1
        },
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
                getStore: function () { return Financial.data.Income.getStore(); },
                itemTpl: [
                    '<div class="clearfix">' +
                    '<b class="left">{description}</b>' +
                    '<span class="right money green">{sum:this.formatSum} {id:this.getCurrency}</span>' +
                    '</div>' +
                    '<div class="clearfix" style="margin-top: 10px">' +
                    '<i class="left">{created_at:this.formatDate}</i> <span class="right">{user_id:this.formatUser}</span>' +
                    '</div>',
                    {
                        formatSum: function (sum) {
                            return Financial.util.Format.money(sum);
                        },
                        getCurrency: function () {
                            return Financial.data.Currency.getDefaultCurrency().get('symbol');
                        },
                        formatDate: function (value) {
                            return Ext.util.Format.date(value, 'D d-m-Y');
                        },
                        formatUser: function (userId) {
                            return Financial.data.User.getById(userId).get('first_name');
                        }
                    }
                ],
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