import {memoize} from 'lodash';
import fs from 'fs';
import path from 'path';
import {getDb} from '../getDb';
import Sequelize from 'sequelize';

type ModelType = Sequelize.Model<any, any> & {
    tableName: string;
    associate?: (db: any) => void;
    rawAttributes: any;
    attributes: any;
    name: string;
};

const getModels = memoize(() => {
    const basename = path.basename(module.filename);
    const sql = getDb();
    const models: Record<string, ModelType> = {};

    fs.readdirSync(__dirname)
        .filter((file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
        .forEach((file) => {
            const {name} = path.parse(file);
            const model = sql.import(path.join(__dirname, file));

            models[name] = model as ModelType;
        });

    Object.keys(models).forEach((modelName) => {
        models[modelName].associate?.(models);
    });

    return models;
});

export const getCategoryModel = () => getModels().Category;
export const getCurrencyModel = () => getModels().Currency;
export const getExpenseModel = () => getModels().Expense;
export const getInventoryModel = () => getModels().Inventory;
export const getAccountModel = () => getModels().MoneyLocation;
export const getPropertyModel = () => getModels().Property;
export const getStockModel = () => getModels().Stock;
export const getUserModel = () => getModels().User;
