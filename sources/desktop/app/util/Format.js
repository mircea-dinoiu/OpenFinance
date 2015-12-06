Ext.define('Financial.util.Format', {
    singleton: true,

    money: function (value) {
        return Ext.util.Format.number(value, '0,0.00');
    },

    recordToUserIcon: function (record) {
        return Ext.String.format(
            '<span class="user-icon"><img src="{0}" alt="{1}" data-qtip="{2}"></span>',
            record.get('avatar'),
            record.get('full_name'),
            Ext.String.format(
                "<div class='text-center'>{1}<img src='{0}' class='display-block'></div>",
                record.get('avatar'),
                record.get('full_name')
            )
        );
    },

    userIcon: function (id) {
        return this.recordToUserIcon(Financial.data.User.getById(id));
    },

    userIcons: function (ids) {
        var ret = [],
            me = this;

        Financial.data.User.getStore().each(function (user) {
            if (ids.indexOf(user.id) !== -1) {
                ret.push(me.recordToUserIcon(user));
            }
        });

        return ret.join('');
    }
});