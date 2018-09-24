const express = require('express');
const router = express.Router();
const { getScriptSrc } = require('../helpers');
// config
const config = require('config');
const localDevMode = config.get('localDevMode');
const debug = config.get('debug');

router.get('/', (req, res) => {
    const data = {
        csrfToken: req.csrfToken ? req.csrfToken() : '',
        debug,
        localDevMode,
        assetHost: config.get('devServer.enable')
            ? config.get('devServer.hostname')
            : '',
    };

    res.render('responsive', {
        ...data,
        scriptSrc: getScriptSrc('bundles/Responsive.js'),
    });
});

module.exports = router;
