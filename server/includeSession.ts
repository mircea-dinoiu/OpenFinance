import expressSession from 'express-session';
import {getDb} from './getDb';

export const includeSession = (app) => {
    if (!process.env.SESSION_SECRET) {
        throw new Error('Invalid SESSION_SECRET');
    }

    const SequelizeStore = require('connect-session-sequelize')(expressSession.Store);

    app.use(
        expressSession({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            store:
                process.env.SESSION_STORE === 'mode'
                    ? new expressSession.MemoryStore()
                    : new SequelizeStore({
                          db: getDb(),
                      }),
        }),
    );
};
