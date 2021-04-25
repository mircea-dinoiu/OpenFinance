const express = require('express');
const fs = require('fs');

module.exports = () => {
    const router = express.Router();

    router.get('/', (req, res) => {
        const csrfToken = req.csrfToken ? req.csrfToken() : '';

        fs.readFile('build/app.html', (err, contents) => {
            if (err) {
                res.send('Fatal error');
                console.error(err);
            } else {
                res.send(contents.toString().replace('%CSRF_TOKEN%', csrfToken));
            }
        });
    });

    return router;
};
