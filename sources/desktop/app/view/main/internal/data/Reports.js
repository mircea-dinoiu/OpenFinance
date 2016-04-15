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

    var includeStore = Ext.create('Ext.data.Store', {
        fields: ['id', 'name'],
        data: [
            {
                id: 'all',
                name: 'Everything'
            },
            {
                id: 'ut',
                name: 'Until today'
            },
            {
                id: 'ld',
                name: '1 day before'
            },
            {
                id: 'lw',
                name: '1 week before'
            },
            {
                id: 'lm',
                name: '1 month before'
            },
            {
                id: 'ly',
                name: '1 year before'
            }
        ]
    });

    Ext.define('Financial.view.main.internal.data.Reports', {
        extend: 'Ext.panel.Panel',

        requires: [
            'Financial.view.main.internal.data.reports.ReportGrid',
            'Financial.view.main.internal.data.ReportsController'
        ],

        layout: {
            type: 'vbox',
            align: 'stretch',
            pack: 'start'
        },

        autoScroll: true,

        controller: 'app-main-internal-data-reports',
        xtype: 'app-main-internal-data-reports',

        items: [
            {
                xtype: 'combo',
                fieldLabel: 'Include:',
                labelWidth: 50,
                store: includeStore,
                margin: '5px',
                queryMode: 'local',
                valueField: 'id',
                displayField: 'name',
                value: 'lm',
                forceSelection: true,
                editable: false,
                listeners: {
                    change: 'onIncludeChange'
                }
            },
            {
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
                                        return Financial.data.MLType.getNameById(id);
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
                        title: 'Balance by user'
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
                                        return Financial.data.Category.getNameById(id);
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
                                        return Financial.data.MLType.getNameById(id);
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
            }
        ]
    });
}());