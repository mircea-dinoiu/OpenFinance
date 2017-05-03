const express = require('express');
const router = express.Router();
const Controller = require('../controllers/UserController');
const passport = require('passport');
const filters = require('../filters');

router.get('/list', filters.auth, async (req, res) => {
    res.wrapPromise(Controller.getList(req, res));
});

router.post(
    '/login',
    filters.guest,
    async (req, res, next) => {
        passport.authenticate('local', function (err, user) {
            if (err) {
                return next(err);
            }

            if (!user) {
                res.status(400);
                res.json('Invalid email or password entered.');
                return;
            }

            req.logIn(user, async (err) => {
                if (err) {
                    return next(err);
                }

                await Controller.getList(req, res);
            });
        })(req, res, next);
    }
);

router.post('/logout', filters.auth, (req, res) => {
    req.session.destroy();

    if (req.xhr) {
        res.send({});
    } else {
        res.redirect('/');
    }
});

module.exports = router;
