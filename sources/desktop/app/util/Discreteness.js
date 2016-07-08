Ext.define('Financial.util.Discreteness', {
    singleton: true,

    minOpacity: 0.2,

    store: new Ext.util.LocalStorage({
        id: 'discreteness'
    }),

    getValue: function () {
        return Number(this.store.getItem('value')) || 0;
    },

    setValue: function (value) {
        this.store.setItem('value', value);

        this.apply();
    },

    toOpacity: function () {
        var reference = 1 - this.minOpacity;
        var perc = parseInt(this.getValue() * reference);

        return this.minOpacity + (reference - perc / 100);
    },

    apply: function () {
        var tabPanel = Financial.app.getMainView().down('app-main-internal > tabpanel');

        tabPanel.setStyle('opacity', this.toOpacity());
    }
});