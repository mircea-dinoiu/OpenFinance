(function () {
    var displayStore = Ext.create('Ext.data.Store', {
        fields: ['id', 'name'],
        data: [
            {
                id: 'cm',
                name: 'Current month'
            },
            {
                id: 'am',
                name: 'All months'
            },
            {
                id: 'ay',
                name: 'All years'
            }
        ]
    });

    Ext.define('Financial.view.main.internal.charts.BaseChartPanel', {
        extend: 'Ext.panel.Panel',

        requires: [
            'Financial.view.main.internal.charts.BaseChartPanelController'
        ],

        xtype: 'app-main-internal-charts-baseChartPanel',
        controller: 'app-main-internal-charts-baseChartPanel',

        initComponent: function () {
            this.on('afterrender', this.addItems, this);
            this.callParent(arguments);
        },

        addItems: function () {
            this.addDocked(this.getFiltersConfig());
            this.add({
                xtype: 'container',
                itemId: 'chart-placeholder',
                height: '100%',
                layout: 'fit'
            });
            setTimeout(this.drawChart.bind(this), 0);
        },

        getFiltersConfig: function () {
            return [
                {
                    xtype: 'panel',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    padding: '30px 10px 10px',
                    items: [
                        {
                            xtype: 'combo',
                            fieldLabel: 'Display:',
                            labelWidth: 50,
                            store: displayStore,
                            itemId: 'display',
                            queryMode: 'local',
                            valueField: 'id',
                            displayField: 'name',
                            value: 'am',
                            forceSelection: true,
                            editable: false,
                            listeners: {
                                change: 'onDisplayChange'
                            }
                        },
                        {
                            xtype: 'tbfill'
                        },
                        {
                            xtype: 'button',
                            text: 'Uncheck all',
                            margin: '0 10px 0 0',
                            handler: 'onUncheckAll'
                        },
                        {
                            xtype: 'button',
                            text: 'Check all',
                            margin: '0 10px 0 0',
                            handler: 'onCheckAll'
                        }
                    ]
                }
            ];
        },

        drawChart: function () {},
        
        replaceChart: function (chart) {
            var placeholder = this.down('[itemId="chart-placeholder"]');

            placeholder.removeAll();
            placeholder.add(chart);
        },
        
        getDisplayComboValue: function () {
            return this.down('combo[itemId="display"]').getValue();
        },
        
        getTimeFormat: function () {
            var timeDisplayFormat;
            var timeValueFormat;
            
            switch (this.getDisplayComboValue()) {
                case 'am':
                    timeDisplayFormat = 'M Y';
                    timeValueFormat = 'Y-m';
                    break;
                case 'ay':
                    timeDisplayFormat = 'Y';
                    timeValueFormat = 'Y';
                    break;
                case 'cm':
                    timeDisplayFormat = 'D, j M';
                    timeValueFormat = 'Y-m-d';
                    break;
            }
            
            return {
                display: timeDisplayFormat,
                value: timeValueFormat
            };
        },

        recordIsInRange: function (record) {
            switch (this.getDisplayComboValue()) {
                case 'cm':
                    var format = 'Y-m';

                    if (Ext.util.Format.date(record.get('created_at'), format) === Ext.util.Format.date(new Date(), format)) {
                        return true;
                    }
                    return false;
            }

            return true;
        }
    });
}());