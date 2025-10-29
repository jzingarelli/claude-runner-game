import 'dotenv/config';
import mongoose from 'mongoose';
import { PlanModel } from '../models/Plan';
import { PermissionModel } from '../models/Permission';

async function main() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/enterprise';
  await mongoose.connect(uri);

  // Seed plans
  const plans = [
    { key: 'basic', name: 'Basic', priceMonthlyCents: 990, limits: { users: 5, postsPerMonth: 100, storageGb: 5 } },
    { key: 'pro', name: 'Pro', priceMonthlyCents: 2990, limits: { users: 25, postsPerMonth: 1000, storageGb: 50 } },
    { key: 'enterprise', name: 'Enterprise', priceMonthlyCents: 9990, limits: { users: 200, postsPerMonth: 20000, storageGb: 500 } },
  ];
  for (const p of plans) {
    await PlanModel.updateOne({ key: p.key }, { $set: p }, { upsert: true });
  }

  // Seed permissions
  const permissionKeys = [
    'user:read','user:write','post:read','post:write','comment:read','comment:write',
    'report:read','report:write','analytics:read','analytics:write','team:read','team:write',
    'permission:read','permission:write','billing:read','billing:write','webhook:read','webhook:write'
  ];
  for (const key of permissionKeys) {
    await PermissionModel.updateOne({ key }, { $set: { key } }, { upsert: true });
  }

  await mongoose.disconnect();
  console.log('Seed complete');
}

main().catch((e) => { console.error(e); process.exit(1); });
