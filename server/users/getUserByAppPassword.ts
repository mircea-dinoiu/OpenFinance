import {getUserModel, getAppPasswordModel} from '../models';
import {TUser} from '../../src/users/defs';
import bcrypt from 'bcrypt';

export const getUserByAppPassword = (email: string, password: string) => {
    const UserModel = getUserModel();
    const AppPasswordModel = getAppPasswordModel();

    return new Promise<TUser | null>(async (resolve, reject) => {
        const user = await UserModel.findOne({
            where: {
                email,
            },
        });

        if (!user) {
            resolve(null);

            return;
        }

        const appPasswordsForUser = await AppPasswordModel.findAll({
            where: {
                user_id: user.id,
            },
        });

        const tests = await Promise.all(
            appPasswordsForUser.map((appPasswordRecord) => bcrypt.compare(password, appPasswordRecord.password)),
        );

        if (tests.some((passed) => passed === true)) {
            resolve(user);
        } else {
            resolve(null);
        }
    });
};