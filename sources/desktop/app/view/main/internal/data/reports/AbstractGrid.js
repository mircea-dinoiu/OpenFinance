Ext.define('Financial.view.main.internal.data.reports.AbstractGrid', {
    extend: 'Ext.grid.Panel',
    hideHeaders: true,

    initComponent: function () {
        this.store = Ext.create('Financial.store.data.ReportStore');

        this.callParent(arguments);

        this.getView().on('expandbody', this.onExpandBody, this);

        this.getView().on('collapsebody', this.onCollapseBody, this);

        this.filters = [];
    },

    onExpandBody: function (rowNode, record) {
        var store = this.getStore();

        store.clearFilter();

        store.each(function (eachRecord) {
            if (eachRecord.get('parent') === record.get('localKey') && eachRecord.get('type') === record.get('type')) {
                eachRecord.set('display', true);
            }
        });

        store.refreshDisplayed();
    },

    onCollapseBody: function (rowNode, record) {
        var store = this.getStore();

        store.clearFilter();

        store.each(function (eachRecord) {
            if (eachRecord.get('parent') === record.get('localKey') && eachRecord.get('type') === record.get('type')) {
                eachRecord.set('display', false);
            }
        });

        store.refreshDisplayed();
    },

    cls: 'fake-expander-grid report-grid',

    viewConfig: {
        getRowClass: function (record) {
            var classes = [];

            if (record.get('description') === 'TOTAL') {
                classes.push('total-row');
            }

            if (record.get('hasChildren') === false) {
                classes.push('non-expandable-row');
            }

            if (record.get('parent') !== false) {
                classes.push('child-row');
            }

            return classes.join(' ');
        },
        loadMask: false
    },

    plugins: [
        {
            ptype: 'rowexpander',
            rowBodyTpl: '&nbsp;'
        }
    ]
});