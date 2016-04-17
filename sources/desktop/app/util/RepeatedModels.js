Ext.define('Financial.util.RepeatedModels', {
    singleton: true,

    getRepeatColumnConfig: function () {
        var store = [
            ['d', 'Daily'],
            ['w', 'Weekly'],
            ['m', 'Monthly'],
            ['y', 'Yearly']
        ];

        return {
            text: 'Repeat',
            dataIndex: 'repeat',
            fit: true,
            align: 'center',
            minWidth: 100,
            resizable: false,
            editor: {
                xtype: 'combo',
                itemId: 'repeat',
                store: store
            },
            renderer: function (value) {
                if (value == null) {
                    return;
                }

                return store.filter(function (item) {
                    return item[0] === value;
                })[0][1];
            }
        };
    },

    advanceRepeatDate: function (obj, rawRepeats) {
        var newObject = Ext.clone(obj);
        var date = new Date(newObject.created_at);
        var repeats = rawRepeats || 1;

        switch (newObject.repeat) {
            case 'd':
                date.setDate(date.getDate() + 1 * repeats);
                break;
            case 'w':
                date.setDate(date.getDate() + 7 * repeats);
                break;
            case 'm':
                date.setMonth(date.getMonth() + 1 * repeats);
                break;
            case 'y':
                date.setFullYear(date.getFullYear() + 1 * repeats);
                break;
        }

        newObject.created_at = date;

        return newObject;
    },

    getClonesFor: function (item, Model, endDate) {
        var out = [];

        if (item.repeat != null) {
            var repeats = 1;

            while (true) {
                var newObject = Financial.util.RepeatedModels.advanceRepeatDate(
                    _.omit(item, 'id'),
                    repeats
                );

                newObject.persist = false;

                if (Ext.util.Format.date(newObject.created_at, 'Y-m-d') > Ext.util.Format.date(endDate, 'Y-m-d')) {
                    break;
                } else {
                    out.push(new Model(newObject));
                    repeats++;
                }
            }
        }

        return out;
    },

    idColumnRenderer: function (value) {
        if (isNaN(parseInt(value))) {
            return '';
        }

        return value;
    },

    generateClones: function (store) {
        var me = this;
        var oldClones = [];
        var newClones = [];
        var endDate = Financial.app.getController('Data').getEndDate();

        store.getRange().forEach(function (record) {
            if (record.isGenerated()) {
                oldClones.push(record);
            } else if (record.get('repeat')) {
                var recordClones = me.getClonesFor(record.data, store.model, endDate);

                if (recordClones.length) {
                    newClones = newClones.concat(recordClones);
                }
            }
        });

        oldClones.forEach(function (record) {
            store.remove(record);
        });
        newClones.forEach(function (record) {
            store.add(record);
        });
    }
});