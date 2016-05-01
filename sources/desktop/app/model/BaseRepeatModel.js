Ext.define('Financial.model.BaseRepeatModel', {
    extend: 'Ext.data.Model',
    
    isGenerated: function () {
        return this.get('persist') === false;
    }
});