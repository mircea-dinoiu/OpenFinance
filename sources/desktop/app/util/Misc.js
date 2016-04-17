Ext.define('Financial.util.Misc', {
    singleton: true,

    generateEICreationDate: function (grid) {
        var createdAt = new Date(),
            sd = Financial.app.getController('Data').getStartDate(),
            ed = Financial.app.getController('Data').getEndDate(),
            date = function (value) {
                return Ext.util.Format.date(value, 'Y-m-d');
            },
            setCreatedAt = function (defaultDate) {
                if (grid.getStore().count()) {
                    createdAt = new Date(grid.getStore().max('created_at'));
                } else {
                    createdAt = new Date(defaultDate);
                }

                createdAt.setSeconds(createdAt.getSeconds() + 1);
            };

        if (ed !== null || sd !== null) {
            if (ed === null) {
                if (date(createdAt) < date(sd)) {
                    setCreatedAt(sd);
                }
            } else if (sd === null) {
                if (date(createdAt) > date(ed)) {
                    setCreatedAt(sd);
                }
            } else if (date(createdAt) < date(sd) ||
                date(createdAt) > date(ed)) {
                setCreatedAt(sd);
            }
        }

        return createdAt;
    },

    anotherCurrenciesTooltip: function (metaData, currency, record) {
        var tooltip = [];

        Ext.Object.each(
            currency.get('rates'),
            function (isoCode, multiplier) {
                tooltip.push([
                    Financial.util.Format.money(record.get('sum') * multiplier),
                    Financial.data.Currency.getCurrencyByISOCode(isoCode).get('symbol')
                ].join(' '));
            }
        );

        metaData.tdAttr = 'data-qtip="' + tooltip.join('<br>') + '"';
    },

    day: function (date) {
        return Ext.util.Format.date(date, 'Y-m-d');
    },
    
    icon: function (opts) {
        return Ext.String.format(
            '<i data-qtip="{0}" style="font-style: normal; color: {1}" class="x-fa fa-{2}" aria-hidden="true"></i>',
            opts.tooltip,
            opts.color,
            opts.type
        );
    }
});