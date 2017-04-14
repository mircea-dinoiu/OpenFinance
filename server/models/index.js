const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(module.filename);
const config = require('config');
const dbConfig = config.get('db');
const db = {};
const sql = new Sequelize(`mysql://${dbConfig.get('user')}:${dbConfig.get('pass')}@${dbConfig.get('host')}/${dbConfig.get('name')}`, {
    timezone: config.get('timezone')
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
