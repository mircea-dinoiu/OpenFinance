const express = require('express');
const router = express.Router();
const PlatformService = require('../services/PlatformService');
const {basePath} = require('../helpers');
const fs = require('fs');

// config
const config = require('config');
const localDevMode = config.get('localDevMode');
const debug = config.get('debug');

router.get('/', function (req, res) {
    PlatformService.detector = req.headers['user-agent'];

    if (PlatformService.isSupported()) {
        const data = {
            isMobile: PlatformService.isMobile(),
            csrfToken: req.csrfToken(),
            debug: debug,
            baseUrl: '',
            localDevMode: localDevMode,
            assetHost: req.cookies.devserver ? req.cookies.devserver : '',
        };

        if (PlatformService.isMobile()) {
            res.render('mobile', data);
        } else {
            fs.readFile(basePath(`${localDevMode ? 'sources/desktop' : 'public'}/microloader.html`), (err, microloader) => {
                res.render('desktop', Object.assign({
                    theme: 'triton',
                    bootstrapScript: String(microloader)
                }, data));
            });
        }
    } else {
        res.render('not-supported');
    }
});

module.exports = router;
