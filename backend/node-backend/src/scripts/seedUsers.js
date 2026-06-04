import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import { mockUsers } from '../utils/mockUsers.js';

dotenv.config();

const seedUsers = async () => {
  try {
    await connectDB();
    await User.deleteMany();

    const createdUsers = await User.insertMany(mockUsers);
    console.log(`${createdUsers.length} users have been added.`);

    mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedUsers();
