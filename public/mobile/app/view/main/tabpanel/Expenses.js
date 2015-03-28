Ext.define('Financial.view.main.tabpanel.Expenses', {
    extend: 'Ext.Container',
    alias: 'widget.main-tabpanel-expenses',

    requires: [
        'Ext.SegmentedButton'
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