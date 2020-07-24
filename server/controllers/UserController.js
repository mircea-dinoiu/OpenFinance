const {sql} = require('../models');
const {QueryTypes} = require('sequelize');
const _ = require('lodash');
const md5 = require('md5');

module.exports = class UserController {
    async list(req, res) {
        const results = await sql.query(
            `select * from projects join project_user on projects.id = project_user.project_id join users on user_id = users.id where project_id in (select project_id from project_user where user_id = :userId)`,
            {
                replacements: {userId: req.user.id},
                type: QueryTypes.SELECT,
            },
        );

        res.json({
            // TODO remove current
            current: req.user,
            user: req.user,
            projects: Object.values(_.groupBy(results, 'project_id')).map(
                (projectsWithUsers) => ({
                    id: projectsWithUsers[0].project_id,
                    name: projectsWithUsers[0].name,
                    default_currency_id:
                        projectsWithUsers[0].default_currency_id,
                    users: projectsWithUsers.map((u) => ({
                        id: u.user_id,
                        avatar: `https://www.gravatar.com/avatar/${md5(
                            u.email.trim().toLowerCase(),
                        )}`,
                        full_name: `${u.first_name} ${u.last_name}`,
                    })),
                }),
            ),
        });
    }
};
