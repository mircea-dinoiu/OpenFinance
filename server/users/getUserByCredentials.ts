import bcrypt from 'bcrypt';
import {getUserModel} from '../models';
import {TUser} from '../../src/users/defs';

export const getUserByCredentials = (email: string, password: string) => {
    const UserModel = getUserModel();

    return new Promise<TUser | null>((resolve, reject) => {
        UserModel.findOne({
            where: {
                email,
            },
        }).then((user, err) => {
            if (err) {
                return reject(err);
            }

            if (!user) {
                return resolve(null);
            }

            bcrypt.compare(password, user.password).then((isValid) => {
                return isValid ? resolve(user) : resolve(null);
            });
        });
    });
};
