import mongoose, { Schema, Document } from 'mongoose';

// ========================
// User Model (Patients)
// ========================
export interface IUser extends Document {
  name: string;
  phoneNumber: string;
  password: string;
  emergencyContact: {
    name: string;
    phoneNumber: string;
  };
  qrCodeId: string; // Unique QR code ID for patient
  height?: number;
  weight?: number;
  bmi?: number;
  bloodGroup?: string;
  photoUrl?: string;
  majorProblem?: string;
  allergies?: string[];
  chronicConditions?: string[];
  currentMedications?: string[];
  medicalReports: { 
    title: string; 
    url: string; 
    uploadedAt: Date;
  }[];
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  emergencyContact: {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true }
  },
  qrCodeId: { type: String, required: true, unique: true }, // QR code ID
  height: { type: Number },
  weight: { type: Number },
  bmi: { type: Number },
  bloodGroup: { type: String },
  photoUrl: { type: String },
  majorProblem: { type: String },
  allergies: { type: [String], default: [] },
  chronicConditions: { type: [String], default: [] },
  currentMedications: { type: [String], default: [] },
  medicalReports: [
    {
      title: { type: String, required: true },
      url: { type: String, required: true },
      uploadedAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model<IUser>('User', userSchema);

// ========================
// Doctor Model
// ========================
export interface IDoctor extends Document {
  name: string;
  email: string;
  password: string;
  specialization: string;
  hospitalId: mongoose.Types.ObjectId;
  phoneNumber: string;
  isOnline: boolean;
  photoUrl?: string;
  bloodGroup?: string;
  reports?: { title: string; url: string; uploadedAt: Date; uploadedBy?: string }[];
  createdAt: Date;
}

const doctorSchema = new Schema<IDoctor>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  specialization: { type: String, required: true },
  hospitalId: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
  phoneNumber: { type: String, required: true },
  photoUrl: { type: String },
  bloodGroup: { type: String },
  reports: [
    {
      title: { type: String, required: false },
      url: { type: String, required: false },
      uploadedAt: { type: Date, default: Date.now },
      uploadedBy: { type: String }
    }
  ],
  isOnline: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const Doctor = mongoose.model<IDoctor>('Doctor', doctorSchema);

// ========================
// Hospital Model
// ========================
export interface IHospital extends Document {
  name: string;
  email: string;
  password: string;
  address: string;
  phoneNumber: string;
  createdAt: Date;
}

const hospitalSchema = new Schema<IHospital>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Hospital = mongoose.model<IHospital>('Hospital', hospitalSchema);

// ========================
// Chat Message Model
// ========================
export interface IChatMessage extends Document {
  chatRoomId: string;
  senderId: mongoose.Types.ObjectId;
  senderType: 'user' | 'doctor';
  message: string;
  timestamp: Date;
  isRead: boolean;
}

const chatMessageSchema = new Schema<IChatMessage>({
  chatRoomId: { type: String, required: true, index: true },
  senderId: { type: Schema.Types.ObjectId, required: true },
  senderType: { type: String, enum: ['user', 'doctor'], required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false }
});

export const ChatMessage = mongoose.model<IChatMessage>('ChatMessage', chatMessageSchema);

// ========================
// Chat Room Model
// ========================
export interface IChatRoom extends Document {
  userId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  status: 'active' | 'closed';
  createdAt: Date;
  lastMessageAt: Date;
}

const chatRoomSchema = new Schema<IChatRoom>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  lastMessageAt: { type: Date, default: Date.now }
});

export const ChatRoom = mongoose.model<IChatRoom>('ChatRoom', chatRoomSchema);

// ========================
// Post Model (Community)
// ========================
export interface IPost extends Document {
  authorId: mongoose.Types.ObjectId;
  authorName: string;
  content: string;
  createdAt: Date;
}

const postSchema = new Schema<IPost>({
  authorId: { type: Schema.Types.ObjectId, required: true },
  authorName: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Post = mongoose.model<IPost>('Post', postSchema);
