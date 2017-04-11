const express = require('express');
const router = express.Router();
const PlatformService = require('../services/PlatformService');
const config = require('config');
const {basePath} = require('../helpers');
const debug = config.get('debug');
const fs = require('fs');

router.get('/', function (req, res) {
    PlatformService.detector = req.headers['user-agent'];

    if (PlatformService.isSupported()) {
        const data = {
            isMobile: PlatformService.isMobile(),
            csrfToken: 'csrfToken',
            debug: debug,
            baseUrl: '',
            assetHost: req.cookies.devserver ? req.cookies.devserver : '',
        };

        if (PlatformService.isMobile()) {
            res.render('mobile', data);
        } else {
            fs.readFile(basePath(`${debug ? 'sources/desktop' : 'public'}/microloader.html`), (err, microloader) => {
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
