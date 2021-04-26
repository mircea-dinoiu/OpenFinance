import passport from 'passport';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';
import {getUserModel} from './models';
import {User} from '../src/users/defs';

export const includeAuth = (app) => {
    const UserModel = getUserModel();

    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',
            },
            (email, pass, cb) => {
                UserModel.findOne({
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

    passport.serializeUser<User, User['id']>((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser<User, User['id']>((id: number, cb) => {
        UserModel.findById(id).then((user) => {
            cb(null, user);
        });
    });

    app.use(passport.initialize());
    app.use(passport.session());
};
