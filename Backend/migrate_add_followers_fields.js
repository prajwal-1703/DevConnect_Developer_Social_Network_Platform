import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import User from './src/models/User.js';

(async function migrate() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const res = await User.updateMany(
      {},
      { $set: { followers: [], following: [] } }
    );
    console.log(`Migration done: ${res.modifiedCount} users patched.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
