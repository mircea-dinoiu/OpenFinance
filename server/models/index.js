const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(module.filename);
const config = require('config');
const dbConfig = config.get('db');
const db = {};
const sql = new Sequelize(dbConfig.get('name'), dbConfig.get('user'), dbConfig.get('pass'), {
    host: dbConfig.get('host'),
    dialect: 'mysql',
    timezone: config.get('timezone'),
    logging: config.get('debug') ? (...args) => {
        console.log(chalk.inverse('SQL:'), ...args.map(arg => chalk.cyan(arg)))
    } : false
});

fs
    .readdirSync(__dirname)
    .filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(function (file) {
        const {name} = path.parse(file);
        const model = sql['import'](path.join(__dirname, file));

        db[name] = model;
    });

Object.keys(db).forEach(function (modelName) {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sql = sql;
db.Sequelize = Sequelize;

module.exports = db;
