import passport from 'passport';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';
import {getUserModel} from './models';

export const includeAuth = (app) => {
    const User = getUserModel();

    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',
            },
            (email, pass, cb) => {
                User.findOne({
                    where: {
                        email,
                    },
                }).then((user, err) => {
                    if (err) {
                        return cb(err);
                    }

                    if (!user) {
                        return cb(null, false);
                    }

                    bcrypt
                        .compare(
                            pass,
                            // legacy password support
                            user.password.replace(/^\$2y(.+)$/i, '$2a$1'),
                        )
                        .then((isValid) => {
                            return isValid ? cb(null, user) : cb(null, false);
                        });
                });
            },
        ),
    );

    passport.serializeUser((user, cb) => {
        cb(null, user.id);
    });

    passport.deserializeUser((id, cb) => {
        User.findById(id).then((user) => {
            cb(null, user);
        });
    });

    app.use(passport.initialize());
    app.use(passport.session());
};
