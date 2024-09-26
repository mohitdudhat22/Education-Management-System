import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';
import dotenv from 'dotenv';
dotenv.config({path: './.env'});

const dbConnect = async () => {
    try {
        const uri = `${process.env.MONGODB_URI}/${DB_NAME}`;
        console.log(`Connecting to MongoDB at: ${uri}`); // Log the connection string for debugging
        await mongoose.connect(uri);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.log('MongoDB connection error:', error);
        throw error;
    }
};

export default dbConnect;