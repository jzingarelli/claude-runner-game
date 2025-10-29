import { PostModel } from '../models/Post';

export async function up() {
  await PostModel.collection.createIndex({ content: 'text' });
}

export async function down() {
  // Mongo creates generated names; in practice we'd track it
}
