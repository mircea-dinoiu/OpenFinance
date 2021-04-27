import {getInventoryModel} from '../models';
import {CrudController} from '../CrudController';

export class InventoryController extends CrudController {
    constructor() {
        super(getInventoryModel());
    }
}
