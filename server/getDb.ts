import Sequelize from 'sequelize';
import logger from './helpers/logger';
import chalk from 'chalk';

let db: Sequelize.Sequelize;

export const getDb = () => {
    if (!db) {
        const url = process.env.DATABASE_URL;

        if (!url) {
            throw new Error('Invalid DATABASE_URL');
        }

        db = new Sequelize(url, {
            dialectOptions: {
                timezone: process.env.TIMEZONE,
            },
            logging:
                process.env.DEBUG === 'true'
                    ? (...args) => {
                          logger.log('SQL', ...args.map((arg) => chalk.cyan(arg)));
                      }
                    : false,
        });
    }

    return db;
};
