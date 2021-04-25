import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import includeAuth from './includeAuth';
import includeCsrf from './includeCsrf';
import includeRoutes from './includeRoutes';
import includeSession from './includeSession';

/**
 * Export the app
 */
export const RequestListener = () => {
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
    includeRoutes(app);

    return app;
};
