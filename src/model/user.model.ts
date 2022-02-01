import mongoose from 'mongoose';

export type Role = 1 | 2;
export type UserType = 'admin' | 'user';
export interface User {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: Role;
    type: UserType;

    createdAt: string;
    updatedAt: string;
}

export type UserReturn = Omit<User, 'password'>

const schema = new mongoose.Schema({

    name: {
        required: true,
        type: String
    },

    email: {
        required: true,
        unique: true,
        type: String
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: Number,
        required: true
    }

}, { timestamps: true });

const UserModel = mongoose.model<User>('User', schema);
export default UserModel

