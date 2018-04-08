const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(module.filename);
const config = require('config');
const db = {};
const sql = new Sequelize(process.env.DATABASE_URL, {
    timezone: config.get('timezone'),
    logging: config.get('debug') ? (...args) => {
        console.log(chalk.inverse('SQL:'), ...args.map(arg => chalk.cyan(arg)));
    } : false
});

fs
    .readdirSync(__dirname)
    .filter((file) => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
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
