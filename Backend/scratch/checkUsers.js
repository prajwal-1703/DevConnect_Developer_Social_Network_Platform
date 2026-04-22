import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = "mongodb://DevConnect:DevConnect%40108@localhost:27017/devconnectDB?authSource=admin";

async function check() {
  await mongoose.connect(MONGO_URI);
  const User = mongoose.model('User', new mongoose.Schema({ username: String }));
  const users = await User.find();
  console.log('Users:');
  for (const u of users) {
    console.log(`- ${u.username} (${u._id})`);
  }
  process.exit(0);
}
check();
