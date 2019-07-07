const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(module.filename);
const config = require('config');
const db = {};
const logger = require('../helpers/logger');

if (process.env.NODE_ENV !== 'test') {
    const sql = new Sequelize(process.env.DATABASE_URL, {
        dialectOptions: {
            timezone: config.get('timezone'),
        },
        logging: config.get('debug')
            ? (...args) => {
                logger.log('SQL', ...args.map((arg) => chalk.cyan(arg)));
            }
            : false,
    });

    fs.readdirSync(__dirname)
        .filter(
            (file) =>
                file.indexOf('.') !== 0 &&
                file !== basename &&
                file.slice(-3) === '.js',
        )
        .forEach((file) => {
            const {name} = path.parse(file);
            const model = sql.import(path.join(__dirname, file));

            db[name] = model;
        });

    Object.keys(db).forEach((modelName) => {
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    });

    db.sql = sql;
    db.Sequelize = Sequelize;

    module.exports = db;
}
