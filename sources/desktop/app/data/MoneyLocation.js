Ext.define('Financial.data.MoneyLocation', {
    extend: 'Financial.base.StoreHandler',

    singleton: true,

    storeId: 'moneyLocation',
    storeClass: 'Financial.store.MoneyLocationStore'
});