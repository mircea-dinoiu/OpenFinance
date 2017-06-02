Ext.define('Financial.util.Format', {
    singleton: true,

    money: function (value) {
        return Ext.util.Format.number(value, '0,0.00');
    },

    currencyColumn: function (rawId) {
        var id = rawId;
        var Currency = Financial.data.Currency;
        var defaultCId = Currency.getDefaultCurrency().get('id');
        var displayCId = Currency.getDisplayCurrency().get('id');
        var ret = Financial.data.Currency.getById(id).get('symbol');

        if (id == defaultCId && defaultCId !== displayCId) {
            ret = ret + ' → ' + Financial.data.Currency.getById(displayCId).get('symbol');
        }

        return ret;
    },

    recordToUserIcon: function (record) {
        return Ext.String.format(
            '<span class="user-icon"><img src="{0}" alt="{1}" data-qtip="{2}"></span>',
            record.get('avatar'),
            record.get('full_name'),
            Ext.String.format(
                '<div class=\'text-center\'>{1}<br><img src=\'{0}\' class=\'inline-block\' style=\'width: 80px; height: 80px;\'></div>',
                record.get('avatar'),
                record.get('full_name')
            )
        );
    },

    mlName: function (id) {
        if (id == 0) {
            return '';
        }

        return Financial.data.ML.getById(id).get('name');
    },

    mlTypeName: function (id) {
        if (id == 0) {
            return '';
        }

        return Financial.data.MLType.getById(id).get('name');
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