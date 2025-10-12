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

// User operations
export const User = {
  async findOne(query: any): Promise<any> {
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

// Doctor operations
export const Doctor = {
  async findOne(query: any): Promise<any> {
    if (query.email) {
      const doctors = Array.from(inMemoryDB.doctors.values());
      for (const doctor of doctors) {
        if (doctor.email === query.email) {
          return doctor;
        }
      }
    }
    if (query._id) {
      return inMemoryDB.doctors.get(query._id) || null;
    }
    return null;
  },

  async findById(id: string): Promise<any> {
    return inMemoryDB.doctors.get(id) || null;
  },

  async create(data: any): Promise<any> {
    const doctor = {
      _id: generateId(),
      ...data,
      isOnline: false,
      createdAt: new Date(),
    };
    inMemoryDB.doctors.set(doctor._id, doctor);
    return doctor;
  },

  async find(query: any = {}): Promise<any[]> {
    const doctors = Array.from(inMemoryDB.doctors.values());
    if (query.isOnline !== undefined) {
      return doctors.filter(d => d.isOnline === query.isOnline);
    }
    return doctors;
  },

  async findByIdAndUpdate(id: string, update: any): Promise<any> {
    const doctor = inMemoryDB.doctors.get(id);
    if (doctor) {
      Object.assign(doctor, update);
      inMemoryDB.doctors.set(id, doctor);
      return doctor;
    }
    return null;
  }
};

// Hospital operations
export const Hospital = {
  async findOne(query: any): Promise<any> {
    if (query.email) {
      const hospitals = Array.from(inMemoryDB.hospitals.values());
      for (const hospital of hospitals) {
        if (hospital.email === query.email) {
          return hospital;
        }
      }
    }
    if (query._id) {
      return inMemoryDB.hospitals.get(query._id) || null;
    }
    return null;
  },

  async findById(id: string): Promise<any> {
    return inMemoryDB.hospitals.get(id) || null;
  },

  async create(data: any): Promise<any> {
    const hospital = {
      _id: generateId(),
      ...data,
      createdAt: new Date(),
    };
    inMemoryDB.hospitals.set(hospital._id, hospital);
    return hospital;
  }
};

// Post operations
export const Post = {
  async create(data: any): Promise<any> {
    const post = {
      _id: generateId(),
      ...data,
      createdAt: new Date(),
    };
    inMemoryDB.posts.set(post._id, post);
    return post;
  },

  async find(): Promise<any[]> {
    return Array.from(inMemoryDB.posts.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
};

// Chat Room operations
export const ChatRoom = {
  async create(data: any): Promise<any> {
    const chatRoom = {
      _id: generateId(),
      ...data,
      status: 'active',
      createdAt: new Date(),
      lastMessageAt: new Date(),
    };
    inMemoryDB.chatRooms.set(chatRoom._id, chatRoom);
    return chatRoom;
  },

  async find(query: any): Promise<any[]> {
    const rooms = Array.from(inMemoryDB.chatRooms.values());
    if (query.userId) {
      return rooms.filter(room => room.userId.toString() === query.userId.toString());
    }
    if (query.doctorId) {
      return rooms.filter(room => room.doctorId.toString() === query.doctorId.toString());
    }
    return rooms;
  },

  async findById(id: string): Promise<any> {
    return inMemoryDB.chatRooms.get(id) || null;
  }
};

// Chat Message operations
export const ChatMessage = {
  async create(data: any): Promise<any> {
    const message = {
      _id: generateId(),
      ...data,
      timestamp: new Date(),
      isRead: false,
    };
    inMemoryDB.chatMessages.set(message._id, message);
    return message;
  },

  async find(query: any): Promise<any[]> {
    const messages = Array.from(inMemoryDB.chatMessages.values());
    if (query.chatRoomId) {
      return messages
        .filter(msg => msg.chatRoomId === query.chatRoomId)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }
    return messages;
  }
};

// Export a function to check if we're using in-memory DB
export function isUsingInMemoryDB(): boolean {
  return true; // Always true for this implementation
}
