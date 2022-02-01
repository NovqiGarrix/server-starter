import supertest from "supertest";
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import authService from "../../src/service/auth.service";
import server from '../../src/server';

const app = server();

const fetch = supertest(app);
const URL = '/api/v1/auth/signUp';

describe('Register Unit Testing', () => {

    beforeAll(async () => {
        try {
            const mongoServer = MongoMemoryServer.create();
            await mongoose.connect((await mongoServer).getUri());
        } catch (error) {
            console.log(error);
        }
    })

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    })

    describe('Register with empty object', () => {
        it('Should return 406', async () => {
            const { statusCode } = await fetch.post(URL).send({});

            expect(statusCode).toBe(406);
        })

        it('Should return error message', async () => {
            const { body: { error } } = await fetch.post(URL).send({});

            expect(error).toHaveLength(4);
            expect(error).toEqual([
                {
                    "field": "name",
                    "message": "Please provide a name to register new account!"
                },
                {
                    "field": "email",
                    "message": "Please provide a email to register new account!"
                },
                {
                    "field": "password",
                    "message": "Please provide a password to register new account!"
                },
                {
                    "field": "type",
                    "message": "Invalid enum value. Expected 'admin' | 'user', received undefined"
                }
            ])
        })
    });

    describe('Register with invalid email and password', () => {
        it('Should return 406 for invalid email', async () => {
            const data = {
                name: "Vqii",
                email: "rixx",
                password: "okeOKEOKEOKE!",
                type: "user"
            }

            const { statusCode } = await fetch.post(URL).send(data);
            expect(statusCode).toBe(406);
        })

        it('Should return 406 for invalid email', async () => {
            const data = {
                name: "Vqii",
                email: "rixxffff@gmail.com",
                password: "kk", // Passowrd less than 8 is invalid
                type: "user"
            }

            const { statusCode } = await fetch.post(URL).send(data);
            expect(statusCode).toBe(406);
        })
    });


    describe('Register Success', () => {

        it('Should return 201', async () => {
            const data = {
                name: "Vqii",
                email: "rixx@gmail.com",
                password: "okeOKEOKEOKE!",
                type: "user"
            }

            const { statusCode } = await fetch.post(URL).send(data);
            expect(statusCode).toBe(201);
        })
    })

})