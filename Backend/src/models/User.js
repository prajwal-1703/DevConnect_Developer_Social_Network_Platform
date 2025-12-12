import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  bio: { type: String },
  location: { type: String },
  github: { type: String },
  website: { type: String },
  avatar: { type: String },
  profilePicUrl: { type: String }, // For uploaded profile pictures
  skills: [{ type: String }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
  followersCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userSchema.index({ name: 1 });
userSchema.index({ username: 1, name: 1 });

// Ensure API responses include `id` and omit sensitive/internal fields
userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.passwordHash;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);
export { User };
export default User;
