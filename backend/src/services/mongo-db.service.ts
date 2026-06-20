import mongoose from 'mongoose';

const { MONGODB_URI, MONGODB_DATABASE, NODE_ENVIRONMENT } = process.env;
if (!MONGODB_URI || !MONGODB_DATABASE) {
  throw new Error('Unable to parse MongoDB environment variables.');
}

export const connectToDatabase = async () => {
  try {
    const connectionOptions = {
      dbName: MONGODB_DATABASE,
      serverSelectionTimeoutMS: NODE_ENVIRONMENT === 'dev-offline' ? 5000 : 10000,
      socketTimeoutMS: NODE_ENVIRONMENT === 'dev-offline' ? 30000 : 45000,
    };

    mongoose.connect(MONGODB_URI, connectionOptions);

    mongoose.connection.on('connected', () => {
      const envLabel = NODE_ENVIRONMENT === 'dev-offline' ? 'local MongoDB' : 'MongoDB';
      console.log(`Connected to ${envLabel} (database: ${MONGODB_DATABASE}).`);
    });

    mongoose.connection.on('error', error => {
      console.error(`MongoDB connection error: ${error}`);
      if (NODE_ENVIRONMENT === 'dev-offline') {
        console.error(
          'Hint: Make sure MongoDB is running locally. Install with: brew install mongodb-community && brew services start mongodb-community',
        );
      }
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Disconnected from MongoDB.');
    });
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error}`);
    process.exit(1);
  }
};
