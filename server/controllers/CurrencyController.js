const {Currency} = require('../models');

module.exports = class CurrencyController {
    async list(req, res) {
        const map = {};
        const rawData = await Currency.findAll();
        const allowedISOCodes = [];

        rawData.forEach((model) => {
            map[model.id] = model.toJSON();

            allowedISOCodes.push(model.iso_code);
        });

        res.json({
            map,
        });
    }
};
