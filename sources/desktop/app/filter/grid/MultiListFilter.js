Ext.define('Financial.filter.grid.MultiListFilter', {
    alias: 'grid.filter.multilist',
    extend: 'Ext.grid.filters.filter.List',

    createFilter: function () {
        var filter = this.callParent(arguments);

        filter.operatorFns[this.operator] = function (candidate) {
            var matchesFilter = true,
                selectedUserIds = this._filterValue,
                presentUserIds = this.getCandidateValue(candidate, selectedUserIds);

            Ext.Array.each(selectedUserIds, function (selectedUserId) {
                if (!Ext.Array.contains(presentUserIds, selectedUserId)) {
                    matchesFilter = false;
                }

                return matchesFilter;
            });

            return matchesFilter;
        };

        return filter;
    }
});