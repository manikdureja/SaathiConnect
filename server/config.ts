import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
<<<<<<< HEAD
import fs from 'fs';
import crypto from 'crypto';
=======
>>>>>>> e928a868f20db69a2347c48ab1b1261ec9fbadf7

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: join(__dirname, '../.env') });

<<<<<<< HEAD
// Persisted JWT secret file (keeps tokens valid across restarts/changes)
const SECRET_FILE = join(__dirname, '../.jwt_secret');

// Determine JWT secret with precedence: persisted file -> env var -> generate & persist
let JWT_SECRET: string | undefined = undefined;
try {
  if (fs.existsSync(SECRET_FILE)) {
    JWT_SECRET = fs.readFileSync(SECRET_FILE, 'utf8').trim();
  } else if (process.env.JWT_SECRET) {
    JWT_SECRET = process.env.JWT_SECRET;
    // persist for future runs
    try {
      fs.writeFileSync(SECRET_FILE, JWT_SECRET, { mode: 0o600 });
      console.log('Persisted JWT secret to .jwt_secret');
    } catch (e) {
      console.warn('Could not write JWT secret to disk:', e);
    }
  } else {
    // generate a strong secret and persist it
    JWT_SECRET = crypto.randomBytes(48).toString('hex');
    try {
      fs.writeFileSync(SECRET_FILE, JWT_SECRET, { mode: 0o600 });
      console.log('Generated and persisted new JWT secret to .jwt_secret');
    } catch (e) {
      console.warn('Could not persist generated JWT secret:', e);
    }
  }
} catch (e) {
  console.warn('Error while handling JWT secret persistence:', e);
  JWT_SECRET = JWT_SECRET || process.env.JWT_SECRET || 'saathi-development-secret';
}

=======
>>>>>>> e928a868f20db69a2347c48ab1b1261ec9fbadf7
export const config = {
  // Server configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database configuration
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/saathi',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    },
  },
  
  // JWT configuration
  jwt: {
<<<<<<< HEAD
    secret: JWT_SECRET || 'saathi-development-secret',
=======
    secret: process.env.JWT_SECRET || 'saathi-development-secret',
>>>>>>> e928a868f20db69a2347c48ab1b1261ec9fbadf7
    expiresIn: '30d',
  },

  // Frontend URL for CORS
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  
  // File upload configuration
  uploads: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
  },
};