import mongoose from 'mongoose';

const DEFAULT_MONGODB_URI = 'mongodb://127.0.0.1:27017/claudia';

let connectionPromise = null;

function getMongoUri() {
  return process.env.MONGODB_URI || process.env.MONGO_URI || DEFAULT_MONGODB_URI;
}

export async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = mongoose
    .connect(getMongoUri(), {
      serverSelectionTimeoutMS: 5000,
    })
    .then((mongooseInstance) => mongooseInstance.connection)
    .catch((error) => {
      connectionPromise = null;
      throw error;
    });

  return connectionPromise;
}

export function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}

export function getDatabaseUri() {
  return getMongoUri();
}