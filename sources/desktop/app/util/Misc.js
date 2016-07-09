Ext.define('Financial.util.Misc', {
    singleton: true,

    generateEICreationDate: function (button) {
        var grid = button.up('grid');
        var now = new Date();
        var firstSelected = grid.getSelection()[0];
        var createdAt = null;
        var setTime = function (date) {
            date.setHours(now.getHours(), now.getMinutes());
        };
        var sd = Financial.app.getController('Data').getStartDate(),
            ed = Financial.app.getController('Data').getEndDate(),
            day = Financial.util.Misc.day;

        var behaviors = {
            'smart': function () {
                [
                    behaviors.relative,
                    behaviors.today,
                    behaviors.max
                ].every(function (behavior) {
                    behavior();

                    return createdAt == null;
                });
            },
            'today': function () {
                if (day(now) <= day(ed)) {
                    createdAt = new Date();
                }
            },
            'max': function () {
                var setCreatedAt = function (defaultDate) {
                    if (grid.getStore().count()) {
                        createdAt = new Date(grid.getStore().max('created_at'));
                    } else {
                        createdAt = new Date(defaultDate);
                    }

                    setTime(createdAt);
                };

                if (sd === null) {
                    setCreatedAt(ed);
                } else if (day(now) < day(sd) ||
                    day(now) > day(ed)) {
                    setCreatedAt(sd);
                }
            },
            'relative': function () {
                if (firstSelected) {
                    createdAt = new Date(firstSelected.get('created_at'));

                    setTime(createdAt);
                }
            }
        };

        behaviors[button.itemId]();

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