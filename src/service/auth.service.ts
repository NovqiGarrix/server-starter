import bcrypt from 'bcryptjs';

import userService from './user.service';
import { Role, User, UserReturn } from '../model/user.model';

const { findOne, createUser } = userService

async function register(newUser: Omit<User, '_id' | 'createdAt' | 'updatedAt' | 'role'>): Promise<UserReturn> {

    const hashPassword = await bcrypt.hash(newUser.password, 12);

    let role: Role;

    switch (newUser.type) {
        case 'admin':
            role = 1
            break;

        default:
            role = 2
            break;
    }

    const user = await createUser({ ...newUser, password: hashPassword, role });
    return user
}

export default { register, findOne }