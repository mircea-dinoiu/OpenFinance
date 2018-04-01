Ext.define('Financial.util.RepeatedModels', {
    singleton: true,

    getRepeatColumnConfig: function () {
        var store = [
            ['d', 'Daily'],
            ['w', 'Weekly'],
            ['2w', 'Every 2 Weeks'],
            ['m', 'Monthly'],
            ['3m', 'Every 3 Months'],
            ['y', 'Yearly']
        ];

        return {
            text: 'Repeat',
            dataIndex: 'repeat',
            align: 'center',
            minWidth: 100,
            resizable: false,
            editor: {
                xtype: 'combo',
                matchFieldWidth: false,
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
            case '2w':
                date.setDate(date.getDate() + 7 * 2 * repeats);
                break;
            case 'm':
                date.setMonth(date.getMonth() + 1 * repeats);
                break;
            case '3m':
                date.setMonth(date.getMonth() + 3 * repeats);
                break;
            case 'y':
                date.setFullYear(date.getFullYear() + 1 * repeats);
                break;
        }

        newObject.created_at = date;

        return newObject;
    },

    idColumnRenderer: function (value) {
        if (isNaN(parseInt(value))) {
            return '';
        }

        return value;
    }
});