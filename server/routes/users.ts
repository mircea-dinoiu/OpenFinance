import express from 'express';
import {UserController} from '../controllers/UserController';
import passport from 'passport';
import {validateAuth, validateGuest} from '../middlewares';

export const createUsersRouter = () => {
    const router = express.Router();
    const c = new UserController();

    router.get('/', validateAuth, async (req, res) => {
        c.list(req, res);
    });

    router.post('/login', validateGuest, async (req, res, next) => {
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
                    // @ts-ignore
                    req.session.cookie.expires = false;
                }

                await c.list(req, res);
            });
        })(req, res, next);
    });

    router.post('/logout', validateAuth, (req, res) => {
        req.session.destroy(() => {});

        if (req.xhr) {
            res.send({});
        } else {
            res.redirect('/');
        }
    });

    router.put('/password/set', validateAuth, (req, res) => {
        c.passwordSet({req, res});
    });

    return router;
};