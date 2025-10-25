// In-memory database implementation for development
import { Types } from 'mongoose';

// In-memory storage
const inMemoryDB = {
  users: new Map<string, any>(),
  doctors: new Map<string, any>(),
  hospitals: new Map<string, any>(),
  posts: new Map<string, any>(),
  chatRooms: new Map<string, any>(),
  chatMessages: new Map<string, any>(),
};

// Helper function to generate ObjectId-like strings
function generateId(): string {
  return new Types.ObjectId().toString();
}

// 🧍 User operations
export const User = {
  async findOne(query: any): Promise<any> {
    // 👇 Add support to find by qrCodeId
    if (query.qrCodeId) {
      const users = Array.from(inMemoryDB.users.values());
      return users.find((u) => u.qrCodeId === query.qrCodeId) || null;
    }

    if (query.phoneNumber) {
      const users = Array.from(inMemoryDB.users.values());
      for (const user of users) {
        if (user.phoneNumber === query.phoneNumber) {
          return user;
        }
      }
    }

    if (query._id) {
      return inMemoryDB.users.get(query._id) || null;
    }

    return null;
  },

  async findById(id: string): Promise<any> {
    return inMemoryDB.users.get(id) || null;
  },

  async create(data: any): Promise<any> {
    const user = {
      _id: generateId(),
      qrCodeId: generateId(),              // 👈 Unique QR code ID for each user
      height: data.height || null,
      weight: data.weight || null,
      bmi: data.bmi || null,
      bloodGroup: data.bloodGroup || null,
      medicalReports: data.medicalReports || [],  // 👈 Array for reports
      ...data,
      createdAt: new Date(),
    };
    inMemoryDB.users.set(user._id, user);
    return user;
  },

  async find(): Promise<any[]> {
    return Array.from(inMemoryDB.users.values());
  }
};
