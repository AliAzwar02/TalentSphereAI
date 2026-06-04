import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Application from '../models/Application.js';
import { mockApplications } from '../utils/mockApplications.js';

dotenv.config();

const seedApplications = async () => {
  try {
    await connectDB();
    await Application.deleteMany();

    // Insert mock applications into the database
    const createdApplications = await Application.insertMany(mockApplications);
    console.log(`${createdApplications.length} applications have been added.`);

    // Close the connection
    mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedApplications();
