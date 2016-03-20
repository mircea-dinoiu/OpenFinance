(function () {
    var formatChildren = function (models) {
        return Ext.String.format(
            '{0} {1}',
            Financial.util.Format.money(models.reduce(function (prev, curr) {
                return prev + curr.get('sum');
            }, 0)),
            Financial.data.Currency.getDefaultCurrency().get('symbol')
        );
    };

    Ext.define('Financial.view.main.internal.data.Reports', {
        extend: 'Ext.panel.Panel',

        requires: [
            'Financial.view.main.internal.data.reports.ReportGrid'
        ],

        layout: {
            type: 'vbox',
            align: 'stretch',
            pack: 'start'
        },

        autoScroll: true,

        xtype: 'app-main-internal-data-reports',

        items: [
            {
                xtype: 'app-main-internal-data-reports-report-grid',
                color: 'green',
                itemId: 'balanceByML',
                title: 'Balance by location',
                features: {
                    ftype: 'groupingsummary',
                    showSummaryRow: false,
                    groupHeaderTpl: [
                        '<div class="clearfix"><span class="group-name" data-qtip="{name:this.formatName}">{name:this.formatName}</span> <span class="group-sum">{children:this.formatChildren}</span></div>',
                        {
                            formatName: function (id) {
                                if (id == 0) {
                                    return '<i>Unclassified</i>';
                                } else {
                                    return Financial.data.MLType.getById(id).get('name');
                                }
                            },
                            formatChildren: formatChildren
                        }
                    ]
                }
            },
            {
                xtype: 'app-main-internal-data-reports-report-grid',
                color: 'green',
                itemId: 'balanceByUser',
                title: 'Balance by user',
                features: {
                    ftype: 'groupingsummary',
                    showSummaryRow: false,
                    groupHeaderTpl: [
                        '<div class="clearfix"><span class="group-name" data-qtip="{name}">{name}</span> <span class="group-sum">{children:this.formatChildren}</span></div>',
                        {
                            formatChildren: formatChildren
                        }
                    ]
                }
            },
            {
                xtype: 'app-main-internal-data-reports-report-grid',
                color: 'orchid',
                itemId: 'expensesByCategory',
                title: 'Expenses by category',
                features: {
                    ftype: 'groupingsummary',
                    showSummaryRow: false,
                    startCollapsed: true,
                    groupHeaderTpl: [
                        '<div class="clearfix"><span class="group-name" data-qtip="{name:this.formatName}">{name:this.formatName}</span> <span class="group-sum">{children:this.formatChildren}</span></div>',
                        {
                            formatName: function (id) {
                                if (id == 0) {
                                    return '<i>Unclassified</i>';
                                } else {
                                    return Financial.data.Category.getById(id).get('name');
                                }
                            },
                            formatChildren: formatChildren
                        }
                    ]
                }
            },
            {
                xtype: 'app-main-internal-data-reports-report-grid',
                color: 'red',
                itemId: 'expensesByML',
                title: 'Expenses by location'
            },
            {
                xtype: 'app-main-internal-data-reports-report-grid',
                color: 'red',
                itemId: 'expensesByUser',
                title: 'Expenses by user'
            },
            {
                xtype: 'app-main-internal-data-reports-report-grid',
                color: 'yellow',
                itemId: 'incomesByML',
                title: 'Incomes by location',
                features: {
                    ftype: 'groupingsummary',
                    showSummaryRow: false,
                    groupHeaderTpl: [
                        '<div class="clearfix"><span class="group-name" data-qtip="{name:this.formatName}">{name:this.formatName}</span> <span class="group-sum">{children:this.formatChildren}</span></div>',
                        {
                            formatName: function (id) {
                                if (id == 0) {
                                    return '<i>Unclassified</i>';
                                } else {
                                    return Financial.data.MLType.getById(id).get('name');
                                }
                            },
                            formatChildren: formatChildren
                        }
                    ]
                }
            },
            {
                xtype: 'app-main-internal-data-reports-report-grid',
                color: 'yellow',
                itemId: 'incomesByUser',
                title: 'Incomes by user'
            }
        ]
    });
}());