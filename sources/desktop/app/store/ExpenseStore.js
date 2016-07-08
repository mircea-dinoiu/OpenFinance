Ext.define('Financial.store.ExpenseStore', {
    extend: 'Financial.store.BaseRepeatStore',

    model: 'Financial.model.ExpenseModel',

    autoLoad: false,
    autoDestroy: false,
    storeId: 'expense',

    sorters: [
        {
            property: 'created_at',
            direction: 'DESC'
        },
        {
            property: 'id',
            direction: 'DESC'
        }
    ]
});