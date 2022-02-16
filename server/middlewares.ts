import {Validator} from './validators';
import {QueryTypes} from 'sequelize';
import {getDb} from './getDb';
import {Request, Response, NextFunction} from 'express';
import {getUserHasProjectAccess} from './projects/getUserHasProjectAccess';

export const validateAuth = (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
};

export const validateAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user && req.user.is_admin) {
        next();
    } else {
        res.sendStatus(401);
    }
};

export const validateProject = async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.projectId) {
        const projectId = Number(req.query.projectId);
        const project = await getUserHasProjectAccess(req.user.id, projectId);

        if (project) {
            req.projectId = projectId;
            next();
        } else {
            res.status(404);
            res.json('Project not found');
        }
    } else {
        res.status(400);
        res.json('Provide projectId');
    }
};

export const validatePayload = (rules, type = 'body') => (req: Request, res: Response, next: NextFunction) => {
    const validator = new Validator(req[type], rules, {req});

    validator.passes().then((passed) => {
        if (passed) {
            next();
        } else {
            res.status(400);
            res.json(validator.errors());
        }
    });
};

export const validateGuest = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        next();
    } else {
        res.status(401);
        res.json('You are already logged in.');
    }
};
