import {getDb} from '../getDb';
import {QueryTypes} from 'sequelize';

export const getUserHasProjectAccess = async (userId: number, projectId: number) => {
    const results = await getDb().query(
        `select * from project_user where project_id = :projectId AND user_id = :userId;`,
        {
            replacements: {
                userId: userId,
                projectId: projectId,
            },
            type: QueryTypes.SELECT,
        },
    );

    return !!results.length;
};
