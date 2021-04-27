import {CrudController} from '../CrudController';
import {getStockModel} from '../models';

export class StocksController extends CrudController {
    constructor() {
        super(getStockModel());
    }

    async list(req, res) {
        res.json(
            await this.Model.findAll({
                order: [['symbol', 'ASC']],
            }),
        );
    }
}
