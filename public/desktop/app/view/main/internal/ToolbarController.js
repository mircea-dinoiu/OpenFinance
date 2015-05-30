Ext.define('Financial.view.main.internal.ToolbarController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.app-main-internal-toolbar',

    doLogout: function () {
        var me = this,
            view = me.getView();

        view.setLoading('Logging out...');

        Ext.Ajax.request({
            url: Ext.String.format('{0}/user/logout', Financial.baseURL),
            method: 'post',
            success: function () {
                view.setLoading(false);
                Financial.data = {};
                Financial.app.show('login');
            },
            failure: function () {
                view.setLoading(false);

                Ext.Msg.alert(
                    'Logout error',
                    'An error has occurred while trying to log you out',
                    Ext.emptyFn
                );
            }
        });
    },

    onUserMenuRender: function (button) {
        var userData = Financial.data.user;

        button.setText(userData.first_name + ' ' + userData.last_name);
    },

    syncButtonWithMonthPicker: function (button) {
        var monthPicker = button.down('monthpicker'),
            value = monthPicker.getValue(),
            month = value[0],
            year = value[1];

        monthPicker.originalValue = monthPicker.getValue();
        button.setText(Ext.Date.monthNames[month] + ' ' + year);
    },

    onSelectMonthButtonRender: function (button) {
        this.syncButtonWithMonthPicker(button);
    },

    onMonthPickerCancel: function (monthPicker) {
        monthPicker.up('menu').hide();
    },

    onMonthPickerHide: function (monthPicker) {
        if (monthPicker.saveChanges) {
            this.syncButtonWithMonthPicker(monthPicker.up('button'));
        } else {
            monthPicker.setValue(monthPicker.originalValue);
        }

        monthPicker.saveChanges = false;
    },

    onMonthPickerOK: function (monthPicker) {
        monthPicker.saveChanges = true;
        menu.hide();
    },

    onCurrencyRender: function (tbText) {
        var interval;

        function setCurrency() {
            var currencyData = Financial.data.currency,
                defaultCurrency = currencyData.default,
                textArr = [];

            Ext.Object.each(currencyData.list, function (ISOCode, currency) {
                if (ISOCode !== defaultCurrency) {
                    textArr.push(Ext.String.format(
                        '<strong>{0}</strong>: <i>{1} {2}</i>',
                        ISOCode,
                        currency.rates[defaultCurrency],
                        currencyData.list[defaultCurrency].symbol
                    ));
                }
            });

            tbText.setHtml(textArr.join('; '));
        }

        setCurrency();

        interval = setInterval(function () {
            if (Financial.data.user) {
                Ext.Ajax.request({
                    url: Ext.String.format('{0}/get-currencies', Financial.baseURL),
                    success: function (response) {
                        Financial.data.currency = Ext.JSON.decode(response.responseText);
                        setCurrency();
                    }
                });
            } else {
                window.clearInterval(interval);
            }
        }, 60 * 1000);
    }
});