import { AnalyticsEventModel } from '../models/AnalyticsEvent';

export async function up() {
  await AnalyticsEventModel.collection.createIndex({ occurredAt: -1 });
}

export async function down() {}
