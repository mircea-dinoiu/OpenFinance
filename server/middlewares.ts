import {Validator} from './validators';
import {QueryTypes} from 'sequelize';
import {getDb} from './getDb';

export const validateAuth = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.status(401);
        res.json('You are not logged in.');
    }
};

export const validateProject = async (req, res, next) => {
    if (req.query.projectId) {
        const results = await getDb().query(
            `select * from project_user where project_id = :projectId AND user_id = :userId;`,
            {
                replacements: {
                    userId: req.user.id,
                    projectId: Number(req.query.projectId),
                },
                type: QueryTypes.SELECT,
            },
        );

        if (results.length) {
            req.projectId = Number(req.query.projectId);
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

export const validatePayload = (rules, type = 'body') => (req, res, next) => {
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

export const validateGuest = (req, res, next) => {
    if (!req.user) {
        next();
    } else {
        res.status(401);
        res.json('You are already logged in.');
    }
};
