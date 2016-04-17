Ext.define('Financial.model.BaseRepeatModel', {
    extend: 'Ext.data.Model',
    
    isFake: function () {
        return isNaN(parseInt(this.get('id'))) && this.get('repeat') != null;
    },

    hasRepeatClones: function () {
        return this.get('repeat') || this.getPrevious('repeat');
    }
});