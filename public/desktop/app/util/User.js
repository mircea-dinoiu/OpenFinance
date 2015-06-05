Ext.define('Financial.util.User', {
    singleton: true,

    getUserById: function (id) {
        var ret;

        Ext.each(Financial.data.user.list, function (user) {
            if (user.id === parseInt(id)) {
                ret = user;
                return false;
            }
        });

        return ret;
    }
});