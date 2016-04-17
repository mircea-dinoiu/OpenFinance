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

    advanceRepeatDate: function (obj, repeats) {
        var newObject = Ext.clone(obj);
        var date = new Date(newObject.created_at);

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
    
    transformRepeated: function (data, Model) {
        var out = [];
        var endDate = Financial.app.getController('Data').getEndDate();

        data.forEach(function (item) {
            if (item.repeat != null) {
                var repeats = 1;

                while (true) {
                    var newObject = Financial.util.RepeatedModels.advanceRepeatDate(item, repeats);

                    if (Ext.util.Format.date(newObject.created_at, 'Y-m-d') > Ext.util.Format.date(endDate, 'Y-m-d')) {
                        break;
                    } else {
                        newObject.id = Model.identifier.generate();

                        out.push(newObject);
                        repeats++;
                    }
                }
            }

            out.push(item);
        });

        return out;
    },
    
    createTransformer: function (modelClassName) {
        var me = this;

        return function (data) {
            return me.transformRepeated(data, Ext.ClassManager.get(modelClassName));
        };
    },
    
    shouldRefreshAllData: function (operation) {
        return operation.getRecords().filter(
            function (record) {
                return record.hasRepeatClones();
            }
        ).length > 0;
    },
    
    idColumnRenderer: function (value) {
        if (isNaN(parseInt(value))) {
            return '';
        }

        return value;
    }
});