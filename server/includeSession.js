const expressSession = require('express-session');
const connectSessionSequelize = require('connect-session-sequelize');

module.exports = (app) => {
    const SequelizeStore = connectSessionSequelize(expressSession.Store);

    app.use(
        expressSession({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            store:
                process.env.SESSION_STORE === 'mode'
                    ? new expressSession.MemoryStore()
                    : new SequelizeStore({
                          db: require('./models').sql,
                      }),
        }),
    );
};
