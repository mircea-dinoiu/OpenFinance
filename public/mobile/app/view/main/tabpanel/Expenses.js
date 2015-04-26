Ext.define('Financial.view.main.tabPanel.Expenses', {
    extend: 'Ext.Container',
    alias: 'widget.main-tabPanel-expenses',

    requires: [
        'Ext.SegmentedButton'
    ],

    config: {
        layout: {
            type: 'vbox'
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
                    },
                    {
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
                    }
                ]
            },
            {
                xtype: 'list',
                fullscreen: true,
                grouped: true,
                flex: 1,
                store: Ext.create('Ext.data.Store', {
                    fields: ['name', 'league', 'division'],
                    sorters: 'name',
                    grouper: {
                        groupFn: function (item) {
                            return item.get('league') + ' ' + item.get('division');
                        } // groupFn
                    }, // grouper
                    data: [{
                        name: 'New York Yankees',
                        league: 'AL',
                        division: 'East'
                    }, {
                        name: 'Tampa Bay',
                        league: 'AL',
                        division: 'East'
                    }, {
                        name: 'Boston',
                        league: 'AL',
                        division: 'East'
                    }, {
                        name: 'Toronto',
                        league: 'AL',
                        division: 'East'
                    }, {
                        name: 'Baltimore',
                        league: 'AL',
                        division: 'East'
                    }, {
                        name: 'Detroit',
                        league: 'AL',
                        division: 'Central'
                    }, {
                        name: 'Cleveland',
                        league: 'AL',
                        division: 'Central'
                    }, {
                        name: 'Chicago White Sox',
                        league: 'AL',
                        division: 'Central'
                    }, {
                        name: 'Kansas City',
                        league: 'AL',
                        division: 'Central'
                    }, {
                        name: 'Minnesota',
                        league: 'AL',
                        division: 'Central'
                    }, {
                        name: 'Texas',
                        league: 'AL',
                        division: 'West'
                    }, {
                        name: 'Los Angeles Angels',
                        league: 'AL',
                        division: 'West'
                    }, {
                        name: 'Oakland',
                        league: 'AL',
                        division: 'West'
                    }, {
                        name: 'Seattle',
                        league: 'AL',
                        division: 'West'
                    }] // data
                }), // store
                itemTpl: '{name}'
            },
            {
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
            }
        ]
    }
});