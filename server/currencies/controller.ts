import {getCurrencyModel} from '../models';

export class CurrencyController {
    async list(req, res) {
        const map = {};
        const rawData = await getCurrencyModel().findAll();

        rawData.forEach((model) => {
            map[model.id] = model.toJSON();
        });

        res.json({
            map,
        });
    }
}
