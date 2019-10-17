const express = require('express');
const router = express.Router();
const Controller = require('../controllers/UserController');
const passport = require('passport');
const filters = require('../filters');

router.get('/list', filters.auth, async (req, res) => {
    res.wrapPromise(Controller.list(req, res));
});

router.post('/login', filters.guest, async (req, res, next) => {
    passport.authenticate('local', (authErr, user) => {
        if (authErr) {
            return next(authErr);
        }

        if (!user) {
            res.status(400);
            res.json('Invalid email or password entered.');

            return;
        }

        req.logIn(user, async (loginErr) => {
            if (loginErr) {
                return next(loginErr);
            }

            if (req.body.remember_me === 'true') {
                // This user won't have to log in for a year
                req.session.cookie.maxAge = 365 * 24 * 60 * 60 * 1000;
            } else {
                // This user should log in again after restarting the browser
                req.session.cookie.expires = false;
            }

            await Controller.list(req, res);
        });
    })(req, res, next);
});

router.post('/logout', filters.auth, (req, res) => {
    req.session.destroy();

    if (req.xhr) {
        res.send({});
    } else {
        res.redirect('/');
    }
});

module.exports = router;
