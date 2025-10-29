import mongoose from 'mongoose';
import { UserModel } from '../models/User';

export async function up() {
  await UserModel.collection.createIndex({ email: 1 }, { unique: true });
}

export async function down() {
  await mongoose.connection.collection('users').dropIndex('email_1');
}
