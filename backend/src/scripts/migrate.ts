import 'dotenv/config';
import { readdirSync } from 'fs';
import path from 'path';
import mongoose from 'mongoose';

async function main() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/enterprise';
  await mongoose.connect(uri);
  const dir = path.join(__dirname, '..', 'migrations');
  const files = readdirSync(dir).filter((f) => f.endsWith('.ts') || f.endsWith('.js')).sort();
  for (const f of files) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require(path.join(dir, f));
    if (mod.up) {
      // eslint-disable-next-line no-console
      console.log('Running migration', f);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      await mod.up();
    }
  }
  await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
