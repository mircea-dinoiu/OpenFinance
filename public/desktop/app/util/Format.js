Ext.define('Financial.util.Format', {
    singleton: true,

    money: function (value) {
        return Math.floor(value * 100) / 100;
    }
});