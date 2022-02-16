import passport from 'passport';
import LocalStrategy from 'passport-local';
import {getUserModel} from '../models';
import {TUser} from '../../src/users/defs';
import {getUserByCredentials} from './getUserByCredentials';

export const includeAuth = (app) => {
    const UserModel = getUserModel();

    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',
            },
            (email, pass, cb) => {
                getUserByCredentials(email, pass)
                    .then((user) => {
                        cb(null, user ?? false);
                    })
                    .catch(cb);
            },
        ),
    );

    passport.serializeUser<TUser, TUser['id']>((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser<TUser, TUser['id']>((id: number, cb) => {
        UserModel.findById(id).then((user) => {
            cb(null, user);
        });
    });

    app.use(passport.initialize());
    app.use(passport.session());
};
