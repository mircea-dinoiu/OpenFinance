const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const app = express();
const Messages = require('./server/Messages');

/**
 * Config
 */
const config = require('config');
const localDevMode = config.get('localDevMode');
const debug = config.get('debug');

/**
 * View engine
 */
app.set('views', path.join(__dirname, 'server', 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

/**
 * Add promise rejection wrapper
 */
const wrapPromise = function (promise) {
    promise.catch(e => {
        console.error(e);
        this.status(500);
        this.json(Messages.ERROR_UNEXPECTED);
    });

    return promise;
};

app.use((req, res, next) => {
    res.wrapPromise = wrapPromise;
    next();
});

/**
 * Cookie parser
 */
const cookieParser = require('cookie-parser');

app.use(cookieParser());

/**
 * Body parser
 */
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/**
 * Session
 */
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

app.use(session({
    secret: config.get('session.secret'),
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({
        db: require('./server/models').sql
    })
}));

/**
 * Authentication
 */
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt-nodejs');

passport.use(new LocalStrategy({
    usernameField: 'email',
}, function (email, pass, cb) {
    const {User} = require('./server/models');

    User.findOne({
        where: {
            email: email
        }
    }).then(function (user, err) {
        if (err) {
            return cb(err);
        }

        if (!user) {
            return cb(null, false);
        }

        if (!bcrypt.compareSync(pass, user.password.replace(/^\$2y(.+)$/i, '\$2a$1'))) {
            return cb(null, false);
        }

        return cb(null, user);
    })
}));

passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
    const {User} = require('./server/models');

    User.findById(id).then(function (user) {
        cb(null, user);
    });
});

app.use(passport.initialize());
app.use(passport.session());

/**
 * CSRF
 */
const csrf = require('csurf');

app.use(csrf({cookie: true}));
app.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') {
        return next(err);
    }

    // handle CSRF token errors here
    res.status(403);
    res.send(debug ? 'Missing CSRF Token' : null);
});

/**
 * Server static assets
 */
app.use(express.static(path.join(__dirname, 'public')));
// Serve from sources/desktop when localDevMode is true
if (localDevMode) {
    app.use(express.static(path.join(__dirname, 'sources/desktop')));
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
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
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
