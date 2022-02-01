import { FilterQuery, UpdateQuery } from 'mongoose';

import UserModel, { User, UserReturn } from "../model/user.model";
import jwt from '../util/jwt';

async function createUser(user: Omit<User, '_id' | 'createdAt' | 'updatedAt'>): Promise<Omit<User, 'password'>> {

    const newUser = await UserModel.create(user);

    return {
        _id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        type: newUser.type,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt
    }

}

async function findOne(filter: FilterQuery<User>, projection?: Record<string, number>): Promise<UserReturn | undefined> {
    return await UserModel.findOne(filter, projection).lean();
}

async function findOneDatas(filter: FilterQuery<User>, projection?: Record<string, number>): Promise<User | undefined> {
    return await UserModel.findOne(filter, projection).lean();
}

async function findById(_id: string, projection?: Record<string, number>): Promise<UserReturn | undefined> {
    return await UserModel.findById(_id, projection).lean();
}


async function finds(filter: FilterQuery<User>, projection?: Record<string, number>): Promise<Array<UserReturn> | []> {
    return await UserModel.find(filter, projection).lean();
}

async function updateOne(filter: FilterQuery<User>, updateQuery: UpdateQuery<User>): Promise<UserReturn | null> {

    const user = await UserModel.findOneAndUpdate(filter, updateQuery);
    if (user) return { ...user, ...updateQuery }

    return null
}

async function reIssueAccessToken(email: string): Promise<string> {

    try {

        return jwt.signToken({ email }, { expiresIn: '15m' });

    } catch (error: any) {
        return "ERROR!"
    }

}


export default { createUser, findOne, findById, reIssueAccessToken, findOneDatas, updateOne, finds }