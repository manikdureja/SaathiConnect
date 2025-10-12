import mongoose, { Document, Schema, Model } from 'mongoose';

// Interface for TypeScript type safety
export interface IUser extends Document {
  name: string;
  phoneNumber: string;
  password: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

// Mongoose Schema
const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  emergencyContactName: { type: String, required: true },
  emergencyContactPhone: { type: String, required: true },
}, { timestamps: true }); // timestamps adds createdAt and updatedAt automatically

// Mongoose Model
export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export interface IDoctor extends Document {
  name: string;
  email: string;
  password: string;
  specialization: string;
  hospitalId: mongoose.Schema.Types.ObjectId; // Relationship
  phoneNumber: string;
  isOnline: boolean;
}

const doctorSchema = new Schema<IDoctor>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  specialization: { type: String, required: true },
  hospitalId: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
  phoneNumber: { type: String, required: true },
  isOnline: { type: Boolean, default: false },
}, { timestamps: true });

export const Doctor: Model<IDoctor> = mongoose.models.Doctor || mongoose.model<IDoctor>('Doctor', doctorSchema);

export interface IHospital extends Document {
  name: string;
  email: string;
  password: string;
  address: string;
  phoneNumber: string;
}

const hospitalSchema = new Schema<IHospital>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
}, { timestamps: true });

export const Hospital: Model<IHospital> = mongoose.models.Hospital || mongoose.model<IHospital>('Hospital', hospitalSchema);

export interface IChatRoom extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  doctorId: mongoose.Schema.Types.ObjectId;
  status: 'active' | 'closed';
  lastMessageAt: Date;
}

const chatRoomSchema = new Schema<IChatRoom>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  lastMessageAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const ChatRoom: Model<IChatRoom> = mongoose.models.ChatRoom || mongoose.model<IChatRoom>('ChatRoom', chatRoomSchema);
export interface IChatMessage extends Document {
  chatRoomId: mongoose.Schema.Types.ObjectId;
  senderId: mongoose.Schema.Types.ObjectId;
  senderType: 'User' | 'Doctor';
  message: string;
  isRead: boolean;
}

const chatMessageSchema = new Schema<IChatMessage>({
  chatRoomId: { type: Schema.Types.ObjectId, ref: 'ChatRoom', required: true },
  senderType: { type: String, required: true, enum: ['User', 'Doctor'] },
  // `refPath` allows the senderId to refer to a different model based on senderType
  senderId: { type: Schema.Types.ObjectId, required: true, refPath: 'senderType' },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
}, { timestamps: true }); // timestamps provides a `createdAt` field for the message time

export const ChatMessage: Model<IChatMessage> = mongoose.models.ChatMessage || mongoose.model<IChatMessage>('ChatMessage', chatMessageSchema);

export interface IPost extends Document {
  authorId: mongoose.Schema.Types.ObjectId;
  authorName: string;
  content: string;
}

const postSchema = new Schema<IPost>({
  // Assuming only 'Users' can create posts. Change 'User' to 'Doctor' if needed.
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: { type: String, required: true }, // Denormalized for easy display
  content: { type: String, required: true },
}, { timestamps: true });

export const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>('Post', postSchema);