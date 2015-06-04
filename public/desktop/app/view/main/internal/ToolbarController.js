Ext.define('Financial.view.main.internal.ToolbarController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.app-main-internal-toolbar',

    applyMonthFilter: function (button) {
        var mainView = button.up('app-main'),
            monthPicker = button.down('monthpicker'),
            value = monthPicker.getValue(),
            month = value[0],
            year = value[1];

        if (!Ext.isDefined(monthPicker.originalValue) || month !== monthPicker.originalValue[0] || year !== monthPicker.originalValue[1]) {
            monthPicker.originalValue = [month, year];
            button.setText(Ext.Date.monthNames[month] + ' ' + year);

            var gridStore = mainView.down('app-main-internal-data-expenses-grid').getStore();

            // todo remove
            month -= 1;

            gridStore.proxy.extraParams = {
                month: month + 1,
                year: year
            };
            gridStore.load();
        }
    },

    navigateToMonth: function (button, getNewValueFn) {
        var monthPickerButton = button.up('toolbar').down('[itemId="month-picker-button"]'),
            monthPicker = monthPickerButton.down('monthpicker'),
            value = monthPicker.getValue();

        monthPicker.setValue(getNewValueFn(value));
        this.applyMonthFilter(monthPickerButton);
    },

    /**
     * Handlers
     */
    onLogoutClick: function () {
        var me = this,
            mainView = me.getView().up('app-main');

        mainView.setLoading('Logging out...');

        Ext.Ajax.request({
            url: Financial.routes.user.logout,
            method: 'post',
            success: function () {
                mainView.setLoading(false);
                Financial.data = {};
                Financial.app.show('login');
            },
            failure: function () {
                mainView.setLoading(false);

                Ext.Msg.alert(
                    'Logout error',
                    'An error has occurred while trying to log you out',
                    Ext.emptyFn
                );
            }
        });
    },

    onUserMenuRender: function (button) {
        var userData = Financial.data.user.current;

        button.setText(userData.full_name);
    },

    onPreviousMonthClick: function (button) {
        this.navigateToMonth(button, function (value) {
            if (value[0] === 0) {
                value[1]--;
                value[0] = 11;
            } else {
                value[0]--;
            }

            return value;
        });
    },

    onNextMonthClick: function (button) {
        this.navigateToMonth(button, function (value) {
            if (value[0] === 11) {
                value[1]++;
                value[0] = 0;
            } else {
                value[0]++;
            }

            return value;
        });
    },

    onMonthPickerButtonRender: function (button) {
        this.applyMonthFilter(button);
    },

    onMonthPickerMenuHide: function (menu) {
        var monthPicker = menu.down('monthpicker');

        if (monthPicker.saveChanges) {
            this.applyMonthFilter(monthPicker.up('button'));
        } else {
            monthPicker.setValue(monthPicker.originalValue);
        }

        monthPicker.saveChanges = false;
    },

    onMonthPickerCancel: function (monthPicker) {
        monthPicker.up('menu').hide();
    },

    onMonthPickerOK: function (monthPicker) {
        monthPicker.saveChanges = true;
        monthPicker.up('menu').hide();
    },

    onCurrencyRender: function (tbText) {
        var interval;

        function setCurrency() {
            var currencyData = Financial.data.currency,
                defaultCurrency = currencyData.default,
                textArr = [];

            Ext.Object.each(currencyData.map, function (id, currency) {
                if (id !== defaultCurrency.id) {
                    textArr.push(Ext.String.format(
                        '<strong>{0}</strong>: <i>{1} {2}</i>',
                        currency.iso_code,
                        currency.rates[defaultCurrency.iso_code],
                        currencyData.map[defaultCurrency.id].symbol
                    ));
                }
            });

            tbText.setHtml(textArr.join('; '));
        }

        setCurrency();

        interval = setInterval(function () {
            if (Financial.data.user) {
                Ext.Ajax.request({
                    url: Financial.routes.getCurrencies,
                    success: function (response) {
                        Financial.app.setCurrency(response);

                        setCurrency();
                    }
                });
            } else {
                window.clearInterval(interval);
            }
        }, 60 * 1000);
    }
});