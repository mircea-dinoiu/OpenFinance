import {QueryTypes} from 'sequelize';
import _ from 'lodash';
import md5 from 'md5';
import bcrypt from 'bcrypt';
import {getDb} from '../getDb';
import crypto from 'crypto';
import {getAppPasswordModel} from '../models';

const MIN_PASSWORD_LENGTH = 20;
const SALT_ROUNDS = 10;

export class UserController {
    async list(req, res) {
        const results = await getDb().query(
            `select * from projects join project_user on projects.id = project_user.project_id join users on user_id = users.id where project_id in (select project_id from project_user where user_id = :userId)`,
            {
                replacements: {userId: req.user.id},
                type: QueryTypes.SELECT,
            },
        );

        res.json({
            user: req.user,
            projects: Object.values(_.groupBy(results, 'project_id')).map((projectsWithUsers: any) => ({
                id: projectsWithUsers[0].project_id,
                name: projectsWithUsers[0].name,
                default_currency_id: projectsWithUsers[0].default_currency_id,
                users: projectsWithUsers.map((u) => ({
                    id: u.user_id,
                    avatar: `https://www.gravatar.com/avatar/${md5(u.email.trim().toLowerCase())}`,
                    full_name: `${u.first_name} ${u.last_name}`,
                })),
            })),
        });
    }

    async passwordSet({res, req}) {
        const {prevPassword, nextPassword} = req.body;

        if (
            'string' !== typeof prevPassword ||
            'string' !== typeof nextPassword ||
            nextPassword.length < MIN_PASSWORD_LENGTH
        ) {
            return res.sendStatus(400);
        }

        const prevPasswordIsValid = await bcrypt.compare(prevPassword, req.user.password);

        if (!prevPasswordIsValid) {
            return res.sendStatus(400);
        }

        const nextPasswordHash = await bcrypt.hash(nextPassword, SALT_ROUNDS);

        await req.user.update({
            password: nextPasswordHash,
        });

        res.sendStatus(200);
    }

    async createAppPassword({req, res}) {
        const {password, name} = req.body;

        const passwordIsValid = await bcrypt.compare(password, req.user.password);

        if (!passwordIsValid) {
            return res.sendStatus(400);
        }

        const appPassword = crypto.randomBytes(MIN_PASSWORD_LENGTH).toString('hex');
        const appPasswordHashed = await bcrypt.hash(appPassword, SALT_ROUNDS);
        const AppPasswordModel = getAppPasswordModel();

        await AppPasswordModel.create({
            name,
            password: appPasswordHashed,
            user_id: req.user.id,
        });

        res.json(appPassword);
    }
}
