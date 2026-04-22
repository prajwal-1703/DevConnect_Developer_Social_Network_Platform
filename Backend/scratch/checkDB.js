import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = "mongodb://DevConnect:DevConnect%40108@localhost:27017/devconnectDB?authSource=admin";

async function check() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to DB');
  
  const Conversation = mongoose.model('Conversation', new mongoose.Schema({
    user1Id: mongoose.Schema.Types.ObjectId,
    user2Id: mongoose.Schema.Types.ObjectId,
    lastMessage: mongoose.Schema.Types.ObjectId
  }));
  
  const Message = mongoose.model('Message', new mongoose.Schema({
    conversationId: mongoose.Schema.Types.ObjectId,
    text: String
  }));
  
  const User = mongoose.model('User', new mongoose.Schema({
    username: String
  }));

  const convs = await Conversation.find();
  console.log('Conversations count:', convs.length);
  
  for (const c of convs) {
    const user1 = await User.findById(c.user1Id);
    const user2 = await User.findById(c.user2Id);
    console.log(`Conv ${c._id}: ${user1?.username} <-> ${user2?.username}`);
    const msgs = await Message.find({ conversationId: c._id });
    console.log(`  Messages: ${msgs.length}`);
    if (msgs.length > 0) {
        console.log(`  Last message: ${msgs[msgs.length-1].text}`);
    }
  }

  process.exit(0);
}

check();
