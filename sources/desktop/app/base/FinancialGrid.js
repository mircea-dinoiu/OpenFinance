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

    listeners: {
        refresh: {
            element: 'store',
            fn: 'onStoreRefresh'
        },
        selectionchange: 'onSelectionChange'
    },

    bbar: [
        {
            xtype: 'tbtext',
            itemId: 'statistics'
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

    getDocked: function () {
        return [
            {
                xtype: 'toolbar',
                dock: 'top',
                items: [
                    {
                        text: Ext.String.format('Add {0}', this.itemName),
                        handler: 'addRecord',
                        itemId: 'addRecordButton'
                    },
                    {
                        xtype: 'tbfill'
                    },
                    {
                        xtype: 'checkbox',
                        boxLabel: Ext.String.format('Display only pending {0}s', this.itemName),
                        handler: 'togglePending'
                    },
                    {
                        xtype: 'tbfill'
                    },
                    {
                        text: 'Deselect All',
                        handler: 'onDeselectAllClick',
                        itemId: 'deselect',
                        disabled: true
                    }
                ]
            }
        ];
    },

    initComponent: function () {
        this.callParent(arguments);

        this.addDocked(this.getDocked());

        this.contextMenu = Ext.create('Ext.menu.Menu', {
            items: this.getContextMenuItems()
        });

        this.store.on('update', function () {
            this.getView().refresh();
        }, this);
    },

    renderFlagColumn: function (value, metaData, record) {
        var format = Ext.String.format;
        var parts = [];

        if (record.get('status') === 'pending') {
            parts.push(
                Financial.util.Misc.icon({
                    tooltip: format('{0} is pending confirmation', Ext.String.capitalize(this.itemName)),
                    color: '#F1C232',
                    type: 'exclamation-triangle'
                })
            );
        }

        if (record.get('repeat')) {
            parts.push(
                Financial.util.Misc.icon({
                    tooltip: format('Recurrent {0}', this.itemName),
                    color: '#3977F1',
                    type: 'repeat'
                })
            );

            if (record.isGenerated()) {
                parts.push(
                    Financial.util.Misc.icon({
                        tooltip: format('Generated {0}', this.itemName),
                        color: '#CC0000',
                        type: 'magic'
                    })
                );
            }
        }

        parts.push(format('<span data-qtip="{0}">{0}</span>', value));

        return parts.join(' ');
    },

    getRowClasses: function (record) {
        var classes = [];
        var day = Financial.util.Misc.day;

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
            scrollend: function (dataView) {
                Financial.util.Events.dataViewAutoFit(dataView);
            },
            beforeselect: function (view, record) {
                if (record.isGenerated()) {
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