import mongoose from 'mongoose';

interface Database {
  generateUri: () => string;
  connect: () => Promise<void>;
}

export const db: Database = {
  generateUri: (): string => {
    const { CLUSTER, DB_NAME, DB_USERNAME, DB_PASSWORD } = process.env;
    return `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${CLUSTER}`;
  },
  connect: async (): Promise<void> => {
    mongoose.set("strictQuery", true)
    mongoose.connection.once('connected', () => {
      console.log('Connected to MongoDB!');
    });
    mongoose.connection.on('error', err => {
      console.error(err);
    });
    await mongoose.connect(db.generateUri(), {
      keepAlive: true,
      keepAliveInitialDelay: 300000,
    });
  },
};
