const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');

module.exports = (app) => {
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',
            },
            (email, pass, cb) => {
                const {User} = require('./models');

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
        const {User} = require('./models');

        User.findById(id).then((user) => {
            cb(null, user);
        });
    });

    app.use(passport.initialize());
    app.use(passport.session());
};
