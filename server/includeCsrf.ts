import csrf from 'csurf';

export const includeCsrf = (app) => {
    if (process.env.USE_CSRF === 'true') {
        app.use(csrf({cookie: true}));
        app.use((err, req, res, next) => {
            if (err.code !== 'EBADCSRFTOKEN') {
                return next(err);
            }

            // handle CSRF token errors here
            res.status(403);
            res.send(process.env.DEBUG === 'true' ? 'Missing CSRF Token' : null);
        });
    }
};
