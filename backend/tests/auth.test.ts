import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from '../src/app/app';

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe('Auth', () => {
  const app = createApp();

  it('registers and logs in a user', async () => {
    const email = `test${Date.now()}@example.com`;
    await request(app)
      .post('/api/v1/auth/register')
      .send({ email, name: 'Test User', password: 'password123' })
      .expect(201);

    const login = await request(app)
      .post('/api/v1/auth/login')
      .send({ email, password: 'password123' })
      .expect(200);

    expect(login.body.accessToken).toBeDefined();
  });
});
