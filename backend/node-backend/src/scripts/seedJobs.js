import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Job from '../models/Job.js';
import { mockJobs } from '../utils/mockJobs.js';

dotenv.config();

const seedJobs = async () => {
  try {
    await connectDB();
    await Job.deleteMany();

    const createdJobs = await Job.insertMany(mockJobs);
    console.log(`${createdJobs.length} jobs have been added.`);

    mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedJobs();
