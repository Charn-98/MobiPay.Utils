import User from '../models/User';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

jest.mock('mongoose', () => ({
  ...jest.requireActual('mongoose'),
  connect: jest.fn(() => {
    console.log('Mock database connection established.');
    return Promise.resolve();
  }),
}));

describe('User model', () => {
   beforeAll(async () => {
    const mongoURI: string = process.env.MONGODB_URI!;
    if (!mongoURI) {
      throw new Error("MONGODB_URI not found in environment variables");
    }
    await mongoose.connect(mongoURI);
  }, 25000);

  afterAll(async () => {
    await mongoose.connection?.close();
  });

  it('Should create a new user and implicitly create the collection', async () => {
    //arrange
    const userData = {
      id: '89f552f3-b011-4a61-b72e-44f4d7b3d00c',
      email: `test-${Date.now()}@example.com`,
      passwordHash: 'password213',
      role: 'analyst',
    };

    //act
    const newUser = await User.create(userData);

    //assert
    expect(newUser).toBeDefined();
    expect(newUser.email).toBe(userData.email);
    expect(newUser.id).toBe(userData.id);
    expect(newUser.role).toBe(userData.role);
  });
});