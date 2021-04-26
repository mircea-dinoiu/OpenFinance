import express from 'express';
import {InventoryController} from '../controllers/InventoryController';
import {validateAuth, validateProject, validatePayload} from '../middlewares';
import {getInventoryModel} from '../models';

export const createInventoriesRouter = () => {
    const router = express.Router();
    const c = new InventoryController();

    router.get('/', [validateAuth, validateProject], async (req, res) => {
        c.list(req, res);
    });

    router.delete(
        '/',
        [
            validateAuth,
            validateProject,
            validatePayload({
                ids: ['isRequired', ['isIdArray', getInventoryModel()]],
            }),
        ],
        (req, res) => {
            // c.destroy(req, res);
        },
    );

    router.put('/', [validateAuth, validateProject], (req, res) => {
        // c.update(req, res);
    });

    router.post('/', [validateAuth, validateProject], (req, res) => {
        // c.create(req, res);
    });

    return router;
};
