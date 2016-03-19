Ext.define('Financial.view.main.internal.ManagerWindow', {
    extend: 'Ext.window.Window',

    frame: true,
    floating: true,
    draggable: false,
    closable: true,
    modal: true,
    resizable: false,
    width: '300px',
    height: '80%',
    closeAction: 'destroy',

    layout: 'fit'
});