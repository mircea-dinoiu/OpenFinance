Ext.define('Financial.view.main.internal.ToolbarController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.app-main-internal-toolbar',

    requires: 'Financial.view.main.internal.ManageCategories',

    dateFormat: 'Y-m-d',

    getDateRangeDisplayValue: function () {
        return Ext.String.format(
            '{0} - {1}',
            this.getStartDateDisplayValue(),
            this.getEndDateDisplayValue()
        );
    },

    getDateDisplayValue: function (button, picker, disabledText) {
        if (button.isDisabled()) {
            return disabledText;
        }

        return Ext.util.Format.date(picker.getValue(), 'M j, Y');
    },

    getStartDateDisplayValue: function () {
        return this.getDateDisplayValue(this.getStartDateButton(), this.getStartDatePicker(), 'Beginning');
    },

    getEndDateDisplayValue: function () {
        return this.getDateDisplayValue(this.getEndDateButton(), this.getEndDatePicker(), 'End');
    },

    shiftMonths: function (months) {
        var sdPicker = this.getStartDatePicker(),
            edPicker = this.getEndDatePicker(),
            sd = sdPicker.getValue(),
            ed = edPicker.getValue();

        sd.setMonth(sd.getMonth() + months);
        sdPicker.setValue(sd);

        ed.setMonth(ed.getMonth() + months);
        edPicker.setValue(ed);

        this.applyFilter();
    },

    setLimits: function (sdPicker, edPicker, refPicker) {
        var sd = new Date(sdPicker.getValue()),
            ed = new Date(edPicker.getValue());

        if (refPicker) {
            if (refPicker === sdPicker) {
                //sd.setMonth(sd.getMonth() + 1);
                //sd.setDate(sd.getDate() - 1);
                edPicker.setMinDate(sd);
            } else {
                //ed.setMonth(ed.getMonth() - 1);
                //ed.setDate(ed.getDate() + 1);
                sdPicker.setMaxDate(ed);
            }
        } else {
            var date = function (value) {
                return Ext.util.Format.date(value, 'Y-m');
            };

            if (date(sdPicker.getValue()) > date(edPicker.getValue()) && this.lastEnabledPicker) {
                if (this.lastEnabledPicker === sdPicker) {
                    ed.setMonth(ed.getMonth() - 1);
                    ed.setDate(ed.getDate() + 1);

                    sdPicker.setValue(ed);
                } else {
                    sd.setMonth(sd.getMonth() + 1);
                    sd.setDate(sd.getDate() - 1);

                    edPicker.setValue(sd);
                }

                delete this.lastEnabledPicker;

                this.applyFilter(false);
            }

            edPicker.setMinDate(sd);
            sdPicker.setMaxDate(ed);
        }
    },

    applyFilter: function (setLimits) {
        var params = {},
            sdButton = this.getStartDateButton(),
            sdPicker = this.getStartDatePicker(),
            edButton = this.getEndDateButton(),
            edPicker = this.getEndDatePicker();

        if (sdButton.rendered && edButton.rendered) {
            sdButton.setText(this.getStartDateDisplayValue());
            edButton.setText(this.getEndDateDisplayValue());

            if (false !== setLimits) {
                this.setLimits(sdPicker, edPicker);
            }

            sdPicker.previousValue = sdPicker.getValue();
            edPicker.previousValue = edPicker.getValue();

            if (!sdButton.isDisabled()) {
                params.start_date = Ext.util.Format.date(sdPicker.getValue(), this.dateFormat);
            }

            if (!edButton.isDisabled()) {
                params.end_date = Ext.util.Format.date(edPicker.getValue(), this.dateFormat);
            }

            Financial.app.getController('Data').loadData(params);
        }
    },

    getStartDateButton: function () {
        return this.getView().down('[itemId="start-date-button"]');
    },

    getStartDatePicker: function () {
        return this.getStartDateButton().down('datepicker');
    },

    getEndDateButton: function () {
        return this.getView().down('[itemId="end-date-button"]');
    },

    getEndDatePicker: function () {
        return this.getEndDateButton().down('datepicker');
    },

    toggleDateButton: function (toggler, button) {
        toggler.setIconCls(button.isDisabled() ? 'icon-checkbox_checked' : 'icon-checkbox');
        button.setDisabled(!button.isDisabled());

        if (!button.isDisabled()) {
            this.lastEnabledPicker = button.down('datepicker');
        }

        if (this.getStartDateButton().isDisabled() || this.getEndDateButton().isDisabled()) {
            this.applyFilter(false);
            this.getStartDatePicker().setMaxDate(null);
            this.getEndDatePicker().setMinDate(null);
        } else {
            this.applyFilter();
        }
    },

    initCurrenciesContainer: function (currenciesContainer) {
        window.clearTimeout(currenciesContainer.timeout);

        function setCurrency() {
            var defaultCurrency = Financial.data.Currency.getDefaultCurrency(),
                textArr = [];

            Financial.data.Currency.getStore().each(function (currency) {
                if (currency.get('id') !== defaultCurrency.get('id')) {
                    textArr.push(Ext.String.format(
                        '<strong>{0}</strong>: {1} <i>{2}</i>',
                        currency.get('iso_code'),
                        currency.get('rates')[defaultCurrency.get('iso_code')],
                        defaultCurrency.get('symbol')
                    ));
                }
            });

            currenciesContainer.setHtml(textArr.join('<br>'));
        }

        setCurrency();

        function fetchCurrencies() {
            currenciesContainer.timeout = setTimeout(function () {
                if (Financial.data.user) {
                    Ext.Ajax.request({
                        url: Financial.routes.getCurrencies + '?update=true',
                        success: function (response) {
                            Financial.data.Currency.setCurrency(response);

                            setCurrency();
                            fetchCurrencies();
                        }
                    });
                } else {
                    window.clearTimeout(currenciesContainer.timeout);
                }
            }, 60 * 1000);
        }

        fetchCurrencies();
    },

    /**
     * Handlers
     */
    onAfterRender: function () {
        var me = this,
            toolbarView = me.getView();

        me.initCurrenciesContainer(toolbarView.down('[itemId="currenciesContainer"]'));
    },

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

    onPreviousMonthClick: function () {
        this.shiftMonths(-1);
    },

    onNextMonthClick: function () {
        this.shiftMonths(1);
    },

    onDateSelect: function (datePicker, date) {
        datePicker.candidateValue = date;
    },

    onDatePickerHide: function (menu) {
        var me = this,
            dp = menu.down('datepicker'),
            date = function (value) {
                return Ext.util.Format.date(value, me.dateFormat);
            };

        if (dp.candidateValue && date(dp.previousValue) !== date(dp.candidateValue)) {
            this.applyFilter(false);
            this.setLimits(this.getStartDatePicker(), this.getEndDatePicker(), dp);
        } else {
            dp.setValue(dp.previousValue);
        }

        delete dp.candidateValue;
    },

    onToggleStartDateButton: function (button) {
        this.toggleDateButton(button, this.getStartDateButton());
    },

    onToggleEndDateButton: function (button) {
        this.toggleDateButton(button, this.getEndDateButton());
    },

    onManageCategoriesClick: function () {
        var panel = Ext.create('Financial.view.main.internal.ManageCategories');

        panel.show();
    }
});