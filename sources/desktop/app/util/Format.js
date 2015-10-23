Ext.define('Financial.util.Format', {
    singleton: true,

    money: function (value) {
        return Ext.util.Format.number(value, '0,0.00');
    }
});