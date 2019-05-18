const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const app = express();
const {wrapPromise} = require('./server/helpers');
/**
 * Config
 */
const config = require('config');
const debug = config.get('debug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));

// HTTP request logger middleware for node.js
app.use(logger('dev'));

/*
 * Serve static assets (before anything else!). We don't need session or filters when serving these.
 */
app.use(express.static(path.join(__dirname, 'public')));

/*
 * Cookie parser
 * -------------
 * Parse Cookie header and populate req.cookies with an object keyed by the cookie names. Optionally you may enable signed cookie support by passing a secret string, which assigns req.secret so it may be used by other middleware.
 */
const cookieParser = require('cookie-parser');

app.use(cookieParser());

/*
 * Body parser
 * -----------
 * Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
 */
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/*
 * View engine (handlebars)
 */
app.set('views', path.join(__dirname, 'server', 'views'));
app.set('view engine', 'hbs');

/*
 * Add promise rejection wrapper
 */
app.use((req, res, next) => {
    res.wrapPromise = wrapPromise;
    req.connection.setNoDelay(true);
    next();
});

/**
 * Session
 */
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

app.use(
    session({
        secret: config.get('session.secret'),
        resave: false,
        saveUninitialized: false,
        store: config.get('memoryStore')
            ? new session.MemoryStore()
            : new SequelizeStore({
                db: require('./server/models').sql,
            }),
    }),
);

/**
 * Authentication
 */
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt-nodejs');

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
        },
        ((email, pass, cb) => {
            const { User } = require('./server/models');

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

                if (
                    !bcrypt.compareSync(
                        pass,
                        user.password.replace(/^\$2y(.+)$/i, '$2a$1'),
                    )
                ) {
                    return cb(null, false);
                }

                return cb(null, user);
            });
        }),
    ),
);

passport.serializeUser((user, cb) => {
    cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
    const { User } = require('./server/models');

    User.findById(id).then((user) => {
        cb(null, user);
    });
});

app.use(passport.initialize());
app.use(passport.session());

/**
 * CSRF
 */
if (config.get('enableCSRF')) {
    const csrf = require('csurf');

    app.use(csrf({ cookie: true }));
    app.use((err, req, res, next) => {
        if (err.code !== 'EBADCSRFTOKEN') {
            return next(err);
        }

        // handle CSRF token errors here
        res.status(403);
        res.send(debug ? 'Missing CSRF Token' : null);
    });
}

/**
 * ROUTES
 */
Object.entries(require('./server/routes')).forEach(([route, handler]) => {
    app.use(route, handler);
});

/**
 * ERROR HANDLING
 */
// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');

    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

/**
 * Export the app
 */
module.exports = app;
