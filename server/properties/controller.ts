import {CrudController} from '../CrudController';
import {getPropertyModel} from '../models';

export class PropertyController extends CrudController {
    constructor() {
        super(getPropertyModel());
    }
}
