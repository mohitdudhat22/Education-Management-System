import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dbConnect from './config/dbConnect.js';
import {swaggerUi, swaggerDocs} from './utils/swagger.js';
import morgan from 'morgan';
import app from './app.js';
const PORT = process.env.PORT || 8080;
// Load environment variables and connect to database
dotenv.config({ path: './.env' });

// dbConnect().then(() => {
//     console.log('Connected to database');
//     // app.on('error', (error) => {
//     //     console.log(error);
//     //     throw error;
//     // });
//     // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// });
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));