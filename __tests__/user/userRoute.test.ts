import mongoose, { mongo } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import supertest from 'supertest';

import server from '../../src/server';

const BASE_URL = '/api/v1/user';
const AUTH_URL = '/api/v1/auth';

const app = server();
const fetch = supertest(app);

describe('User Route Unit Testing', () => {

    beforeAll(async () => {
        const mongo = await MongoMemoryServer.create();
        mongoose.connect(mongo.getUri());
    })

    afterAll(async () => {
        mongoose.disconnect();
        mongoose.connection.close();
    })


    describe('Get Current User', () => {
        let accessToken: string;
        let userId: string;

        it('It should return status code 401 and data is null', async () => {

            // Register new user
            const { statusCode: registerStatusCode } = await fetch.post(`${AUTH_URL}/signUp`).send({
                username: 'cool123',
                email: 'cool123@gmail.com',
                password: 'cool12312',
                name: 'Cool!',
                type: 'user'
            });

            expect(registerStatusCode).toBe(201);

            // Login the user to get accessToken
            const { body: { data: resLoginData } } = await fetch.post(AUTH_URL).send({
                email: 'cool123@gmail.com',
                password: 'cool12312'
            })

            userId = resLoginData._id;
            accessToken = resLoginData.accessToken;

            // Trying getCurrentUser without accessToken
            const { body: { error, data }, statusCode } = await fetch.get(BASE_URL);

            expect(statusCode).toBe(401); // 401 -> HTTP Code for Unauthorized
            expect(error).not.toBeNull();
            expect(data).toBeNull();
        })

        it('Should return currentUser', async () => {
            const { body: { data } } = await fetch.get(BASE_URL).set('x-access-token', accessToken);
            expect({
                _id: userId
            }).toEqual({
                _id: data._id
            })
        })

        it('Should not return user password', async () => {
            const { body: { data } } = await fetch.get(BASE_URL).set('x-access-token', accessToken);

            expect(data?.password).toBeUndefined();
        })
    });

    describe('Get Specific User Information', () => {
        it('Should return status code 406 for invalid request and null data', async () => {
            // Login the user to get accessToken
            const { body: { data: resLoginData } } = await fetch.post(AUTH_URL).send({
                email: 'cool123@gmail.com',
                password: 'cool12312'
            })

            const { body: { data }, statusCode } = await fetch.get(`${BASE_URL}/users`).set('x-access-token', resLoginData.accessToken);
            expect(statusCode).toBe(406);
            expect(data).toBeNull();
        })

        // Find a user using query!
        it('Should return status code 200 and some users information', async () => {
            const { statusCode } = await fetch.post(`${AUTH_URL}/signUp`).send({
                username: 'admin',
                name: 'Admin 3000',
                email: 'admin@gmail.com',
                password: 'admin3000',
                type: 'admin'
            })

            expect(statusCode).toBe(201);

            const { body: { data: loginData, error }, statusCode: loginStatusCode } = await fetch.post(AUTH_URL).send({
                email: 'admin@gmail.com',
                password: 'admin3000'
            })

            expect(error).toBeNull();
            expect({
                email: loginData.email
            }).toEqual({
                email: 'admin@gmail.com'
            })
            expect(loginStatusCode).toBe(200);


            // Find a user in query
            const { body: { data }, statusCode: getUserStatusCode } = await fetch.get(`${BASE_URL}/users?type=user`).set('x-access-token', loginData.accessToken);

            expect(getUserStatusCode).toBe(200);
            expect(data).not.toBe(null);
        })
    })

})