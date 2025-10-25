import { User, Hospital, Doctor, ChatRoom, ChatMessage, Post } from './models';
import type { IUser, IHospital, IDoctor, IChatRoom, IChatMessage, IPost } from './models';

export const DB = {
  User: {
    create: async (data: Partial<IUser>) => {
      const user = new User(data);
      return user.save();
    },
    findOne: async (query: Partial<IUser>) => {
      return User.findOne(query as any);
    },
    findById: async (id: string) => {
      return User.findById(id);
    },
    update: async (id: string, data: Partial<IUser>) => {
      return User.findByIdAndUpdate(id, data, { new: true });
    }
  },

  Hospital: {
    create: async (data: Partial<IHospital>) => {
      const hospital = new Hospital(data);
      return hospital.save();
    },
    findOne: async (query: Partial<IHospital>) => {
      return Hospital.findOne(query as any);
    },
    findById: async (id: string) => {
      return Hospital.findById(id);
    }
  },

  Doctor: {
    create: async (data: Partial<IDoctor>) => {
      const doctor = new Doctor(data);
      return doctor.save();
    },
    findOne: async (query: Partial<IDoctor>) => {
      return Doctor.findOne(query as any);
    },
    findById: async (id: string) => {
      return Doctor.findById(id);
    },
    find: async (query: Partial<IDoctor>) => {
      return Doctor.find(query as any);
    },
    findByHospital: async (hospitalId: string) => {
      return Doctor.find({ hospitalId });
    },
    update: async (id: string, data: Partial<IDoctor>) => {
      return Doctor.findByIdAndUpdate(id, data, { new: true });
    }
  },

  ChatRoom: {
    create: async (data: Partial<IChatRoom>) => {
      const chatRoom = new ChatRoom(data);
      return chatRoom.save();
    },
    find: async (query: Partial<IChatRoom>) => {
      return ChatRoom.find(query as any);
    },
    findById: async (id: string) => {
      return ChatRoom.findById(id);
    }
  },

  ChatMessage: {
    create: async (data: Partial<IChatMessage>) => {
      const message = new ChatMessage(data);
      return message.save();
    },
    find: async (query: Partial<IChatMessage>) => {
      return ChatMessage.find(query as any);
    }
  },

  Post: {
    create: async (data: Partial<IPost>) => {
      const post = new Post(data);
      return post.save();
    },
    find: async (query: Partial<IPost> = {}) => {
      return Post.find(query as any).sort({ createdAt: -1 });
    }
  }
};