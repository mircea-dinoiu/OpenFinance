Ext.define('Financial.store.data.Report', {
    extend: 'Ext.data.Store',

    model: 'Financial.model.data.Report',

    autoDestroy: true,

    groupField: 'type',

    proxy: {
        type: 'memory'
    },

    data: [
        {
            sum: 300,
            type: 'spending',
            description: 'Shared'
        },
        {
            sum: 400,
            type: 'spending',
            description: 'Mircea'
        },
        {
            sum: 500,
            type: 'spending',
            description: 'Olga'
        },
        {
            sum: 1000,
            type: 'remaining',
            description: 'Selected date range'
        },
        {
            sum: 223,
            type: 'remaining',
            description: 'Past'
        }
    ]
});