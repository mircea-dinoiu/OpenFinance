Ext.define('Financial.filter.grid.MultiListFilter', {
    alias: 'grid.filter.multilist',
    extend: 'Ext.grid.filters.filter.List',

    createFilter: function () {
        var filter = this.callParent(arguments);

        filter.operatorFns[this.operator] = function (candidate) {
            var matchesFilter = true,
                selection = this._filterValue,
                recordValue = this.getCandidateValue(candidate, selection);

            Ext.Array.each(selection, function (id) {
                if (recordValue.constructor !== Array) {
                    if (!Ext.Array.contains(selection, recordValue)) {
                        matchesFilter = false;
                    }
                } else if (!Ext.Array.contains(recordValue, id)) {
                    matchesFilter = false;
                }

                return matchesFilter;
            });

            return matchesFilter;
        };

        return filter;
    }
});