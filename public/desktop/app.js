/*
 * This file is generated and updated by Sencha Cmd. You can edit this file as
 * needed for your application, but these edits will have to be merged by
 * Sencha Cmd when upgrading.
 */
Ext.application({
    name: 'Financial',

    extend: 'Financial.Application',

    autoCreateViewport: 'Financial.view.Main',

    //-------------------------------------------------------------------------
    // Most customizations should be made to Financial.Application. If you need to
    // customize this file, doing so below this section reduces the likelihood
    // of merge conflicts when upgrading to new versions of Sencha Cmd.
    //-------------------------------------------------------------------------
    paths: {
        'Financial': 'desktop/app',
        'Financial.view': 'desktop/app/view',
        'Financial.model': 'desktop/app/model',
        'Financial.store': 'desktop/app/store',
        'Financial.controller': 'desktop/app/controller'
    }
});
