Ext.define('Financial.view.main.tabPanel.Expenses', {
    extend: 'Ext.Container',
    alias: 'widget.main-tabPanel-expenses',

    requires: [
        'Ext.SegmentedButton',
        'Financial.data.Expense',
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
                getStore: function () { return Financial.data.Expense.getStore(); },
                itemTpl: [
                    '<div class="clearfix">' +
                        '<b class="left">{item}</b> <span class="right money red">{sum:this.formatSum} {currency_id:this.formatCurrency}</span>' +
                    '</div>' +
                    '<div class="clearfix" style="margin-top: 10px">' +
                        '<i class="left">{created_at:this.formatDate}</i> <span class="right">{users:this.formatUsers}</span>' +
                    '</div>' +
                    '<tpl if="categories.length">' +
                        '<div style="margin-top: 10px; color: #999">{categories:this.formatCategories}</div>' +
                    '</tpl>',
                    {
                        formatSum: function (sum) {
                            return Financial.util.Format.money(sum);
                        },
                        formatCurrency: function (id) {
                            return Financial.data.Currency.getById(id).get('symbol');
                        },
                        formatDate: function (value) {
                            return Ext.util.Format.date(value, 'D d-m-Y');
                        },
                        formatUsers: function (userIds) {
                            var userNames = [];

                            Ext.each(userIds, function (id) {
                                userNames.push(Financial.data.User.getById(id).get('first_name'));
                            });

                            return userNames.join(', ');
                        },
                        formatCategories: function (categoryIds) {
                            var categoryNames = [];

                            Ext.each(categoryIds, function (id, index) {
                                var categoryName = '<sup>' + Financial.data.Category.getById(id).get('name');

                                if (index !== categoryIds.length - 1) {
                                    categoryName += ', ';
                                }

                                categoryName += '</sup>';

                                categoryNames.push(categoryName);
                            });

                            return categoryNames.join(' ');
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