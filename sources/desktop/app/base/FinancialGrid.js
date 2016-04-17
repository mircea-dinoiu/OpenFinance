Ext.define('Financial.base.FinancialGrid', {
    extend: 'Ext.grid.Panel',
    autoScroll: true,

    plugins: [
        {
            ptype: 'rowediting',
            listeners: {
                canceledit: 'onCancelRowEditing',
                beforeedit: 'onBeforeRowEditing',
                edit: 'onRowEditing'
            }
        },
        {
            ptype: 'gridfilters'
        }
    ],

    getContextMenuItems: function () {
        return [
            {
                text: 'Flag as finished',
                iconCls: 'x-fa fa-lock',
                handler: this.getController().onMarkSelectionAsFinishedClick.bind(this.getController())
            },
            {
                text: 'Flag as pending',
                iconCls: 'x-fa fa-unlock',
                handler: this.getController().onMarkSelectionAsPendingClick.bind(this.getController())
            },
            {
                xtype: 'menuseparator'
            },
            {
                text: 'Delete',
                iconCls: 'x-fa fa-minus-circle',
                handler: this.getController().onDeleteSelectedRecordsClick.bind(this.getController())
            },
            {
                text: 'Duplicate',
                iconCls: 'x-fa fa-files-o',
                handler: this.getController().onDuplicateSelectedRecordsClick.bind(this.getController())
            },
            {
                xtype: 'menuseparator'
            },
            {
                text: 'Round sum',
                iconCls: 'x-fa fa-arrows-v',
                handler: this.getController().onRoundRecordSumClick.bind(this.getController())
            },
            {
                text: 'Ceil sum',
                iconCls: 'x-fa fa-long-arrow-up',
                handler: this.getController().onCeilRecordSumClick.bind(this.getController())
            },
            {
                text: 'Floor sum',
                iconCls: 'x-fa fa-long-arrow-down',
                handler: this.getController().onFloorRecordSumClick.bind(this.getController())
            }
        ];
    },

    initComponent: function () {
        this.callParent(arguments);

        this.contextMenu = Ext.create('Ext.menu.Menu', {
            items: this.getContextMenuItems()
        });
    },
    
    getRowClasses: function (record) {
        var classes = [];
        var day = Financial.util.Misc.day;

        classes.push('financial-grid-' + record.get('status') + '-row');
        
        if (record.isFake()) {
            classes.push('fake-row');
        }

        if (record.get('created_at').getDate() % 2 === 0) {
            classes.push('even-row');
        } else {
            classes.push('odd-row');
        }

        if (day(record.get('created_at')) === day(new Date())) {
            classes.push('today-row');
        } else if (day(record.get('created_at')) > day(new Date())) {
            classes.push('future-row');
        }

        return classes;
    },

    viewConfig: {
        getRowClass: function () {
            return this.grid.getRowClasses.apply(this.grid, arguments).join(' ');
        },
        listeners: {
            refresh: function (dataView) {
                Financial.util.Events.dataViewAutoFit(dataView);
            },
            beforeselect: function (view, record) {
                if (record.isFake()) {
                    return false;
                }
            },
            itemcontextmenu: function (view, record, item, index, e) {
                e.stopEvent(); // stops the default event. i.e. Windows Context Menu

                if (view.grid.getSelection().length > 0) {
                    view.grid.contextMenu.showAt(e.getXY()); // show context menu where user right clicked
                }

                return false;
            }
        },
        loadMask: false,
        stripeRows: false
    },

    selModel: {
        selType: 'rowmodel', // rowmodel is the default selection model
        mode: 'MULTI' // Allows selection of multiple rows
    }
});