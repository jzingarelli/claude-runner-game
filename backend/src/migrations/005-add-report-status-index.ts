import { ReportModel } from '../models/Report';

export async function up() {
  await ReportModel.collection.createIndex({ status: 1 });
}

export async function down() {}
