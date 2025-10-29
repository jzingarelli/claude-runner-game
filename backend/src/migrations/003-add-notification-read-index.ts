import { NotificationModel } from '../models/Notification';

export async function up() {
  await NotificationModel.collection.createIndex({ userId: 1, read: 1 });
}

export async function down() {}
