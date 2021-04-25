const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const includeAuth = require('./includeAuth');
const includeCsrf = require('./includeCsrf');
const includeRoutes = require('./includeRoutes');
const includeSession = require('./includeSession');

/**
 * Export the app
 */
module.exports = () => {
    require('express-async-errors');
    const app = express();

    // uncomment after placing your favicon in /public
    app.use(favicon(path.join(__dirname, '..', 'public', 'favicon.png')));

    // HTTP request logger middleware for node.js
    app.use(logger('dev'));

    /*
     * Serve static assets (before anything else!). We don't need session or filters when serving these.
     */
    app.use(express.static(path.join(__dirname, 'build')));

    /*
     * Cookie parser
     * -------------
     * Parse Cookie header and populate req.cookies with an object keyed by the cookie names. Optionally you may enable signed cookie support by passing a secret string, which assigns req.secret so it may be used by other middleware.
     */
    app.use(cookieParser());

    /*
     * Body parser
     * -----------
     * Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
     */
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));

    /*
     * Add promise rejection wrapper
     */
    app.use((req, res, next) => {
        req.connection.setNoDelay(true);
        next();
    });

    /**
     * Session
     */
    includeSession(app);

    /**
     * Authentication
     */
    includeAuth(app);

    /**
     * CSRF
     */
    includeCsrf(app);

    /**
     * ROUTES
     */
    includeRoutes(app)

    return app;
};
