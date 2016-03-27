Ext.define('Financial.util.Events', {
    singleton: true,

    dataViewAutoFit: function (dataView) {
        Ext.each(dataView.panel.columns, function (column) {
            if (column.fit === true) {
                column.autoSize();
            }
        });
    }
});