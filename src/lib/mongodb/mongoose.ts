import mongoose from 'mongoose';

let initialized = false;
export async function connect() {
  mongoose.set('strictQuery', true);

  if (initialized) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI!, { dbName: 'x-clone' });
    console.log('Connected to database');
  } catch (error: any) {
    console.log('Mongodb connection error', error.message);
  }
}
