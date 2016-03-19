Ext.define('Financial.view.main.internal.ManageCategories', {
    extend: 'Financial.view.main.internal.ManagerWindow',
    requires: 'Financial.view.main.internal.manageCategories.CategoriesGrid',

    title: 'Manage Categories',

    items: [
        {
            xtype: 'app-main-internal-manageCategories-grid'
        }
    ]
});