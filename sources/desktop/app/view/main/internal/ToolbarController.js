Ext.define('Financial.view.main.internal.ToolbarController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.app-main-internal-toolbar',

    requires: [
        'Financial.view.main.internal.ManageCategories',
        'Financial.view.main.internal.ManageMLs',
        'Financial.view.main.internal.ManageMLTypes'
    ],

    dateFormat: 'Y-m-d',
    
    getDateDisplayValue: function (picker) {
        return Ext.util.Format.date(picker.getValue(), 'M j, Y');
    },

    getEndDateDisplayValue: function () {
        return this.getDateDisplayValue(this.getEndDatePicker());
    },

    shiftMonths: function (months) {
        var edPicker = this.getEndDatePicker(),
            ed = edPicker.getValue();

        ed.setMonth(ed.getMonth() + months);
        edPicker.setValue(ed);

        this.applyFilter(true);
    },

    applyFilter: function (buffered) {
        var params = {},
            edButton = this.getEndDateButton(),
            edPicker = this.getEndDatePicker();

        if (edButton.rendered) {
            edButton.setText(this.getEndDateDisplayValue());

            edPicker.previousValue = edPicker.getValue();
            params.end_date = Ext.util.Format.date(edPicker.getValue(), this.dateFormat);

            if (buffered === true) {
                this.bufferedLoadData();
            } else {
                Financial.app.getController('Data').loadData(params);
            }
        }
    },

    bufferedLoadData: Ext.Function.createBuffered(function (params) {
        Financial.app.getController('Data').loadData(params);
    }, 500),

    getEndDateButton: function () {
        return this.getView().down('[itemId="end-date-button"]');
    },

    getEndDatePicker: function () {
        return this.getEndDateButton().down('datepicker');
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

        button.setText(
            Ext.String.format(
                '<span class="user-icon"><img src="{0}"></span>',
                userData.avatar
            ) +
            userData.full_name
        );
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
            this.applyFilter();
        } else {
            dp.setValue(dp.previousValue);
        }

        delete dp.candidateValue;
    },

    onManageCategoriesClick: function () {
        var panel = Ext.create('Financial.view.main.internal.ManageCategories');

        panel.show();
    },

    onManageMLsClick: function () {
        var panel = Ext.create('Financial.view.main.internal.ManageMLs');

        panel.show();
    },

    onManageMLTypesClick: function () {
        var panel = Ext.create('Financial.view.main.internal.ManageMLTypes');

        panel.show();
    }
});