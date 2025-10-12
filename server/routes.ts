import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { connectDB, shouldUseInMemoryDB } from "./db";
import { User, Doctor, Hospital, ChatMessage, ChatRoom, Post } from "./models"; // Import all models
import * as InMemoryDB from "./inMemoryDB";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Database abstraction layer
const DB = {
  User: {
    findOne: (query: any) => shouldUseInMemoryDB() ? InMemoryDB.User.findOne(query) : User.findOne(query),
    findById: (id: string) => shouldUseInMemoryDB() ? InMemoryDB.User.findById(id) : User.findById(id),
    create: (data: any) => shouldUseInMemoryDB() ? InMemoryDB.User.create(data) : User.create(data),
    find: () => shouldUseInMemoryDB() ? InMemoryDB.User.find() : User.find(),
  },
  Doctor: {
    findOne: (query: any) => shouldUseInMemoryDB() ? InMemoryDB.Doctor.findOne(query) : Doctor.findOne(query),
    findById: (id: string) => shouldUseInMemoryDB() ? InMemoryDB.Doctor.findById(id) : Doctor.findById(id),
    create: (data: any) => shouldUseInMemoryDB() ? InMemoryDB.Doctor.create(data) : Doctor.create(data),
    find: (query: any = {}) => shouldUseInMemoryDB() ? InMemoryDB.Doctor.find(query) : Doctor.find(query),
    findByIdAndUpdate: (id: string, update: any) => shouldUseInMemoryDB() ? InMemoryDB.Doctor.findByIdAndUpdate(id, update) : Doctor.findByIdAndUpdate(id, update),
  },
  Hospital: {
    findOne: (query: any) => shouldUseInMemoryDB() ? InMemoryDB.Hospital.findOne(query) : Hospital.findOne(query),
    findById: (id: string) => shouldUseInMemoryDB() ? InMemoryDB.Hospital.findById(id) : Hospital.findById(id),
    create: (data: any) => shouldUseInMemoryDB() ? InMemoryDB.Hospital.create(data) : Hospital.create(data),
  },
  Post: {
    create: (data: any) => shouldUseInMemoryDB() ? InMemoryDB.Post.create(data) : Post.create(data),
    find: () => shouldUseInMemoryDB() ? InMemoryDB.Post.find() : Post.find(),
  },
  ChatRoom: {
    create: (data: any) => shouldUseInMemoryDB() ? InMemoryDB.ChatRoom.create(data) : ChatRoom.create(data),
    find: (query: any) => shouldUseInMemoryDB() ? InMemoryDB.ChatRoom.find(query) : ChatRoom.find(query),
    findById: (id: string) => shouldUseInMemoryDB() ? InMemoryDB.ChatRoom.findById(id) : ChatRoom.findById(id),
  },
  ChatMessage: {
    create: (data: any) => shouldUseInMemoryDB() ? InMemoryDB.ChatMessage.create(data) : ChatMessage.create(data),
    find: (query: any) => shouldUseInMemoryDB() ? InMemoryDB.ChatMessage.find(query) : ChatMessage.find(query),
  },
};

// Extend Express's Request interface to include the 'user' property from the JWT payload
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        type: 'user' | 'doctor' | 'hospital';
        name: string;
      };
    }
  }
}

// JWT Secret - should be in environment variables for production
const JWT_SECRET = process.env.JWT_SECRET || "saathislove";

if (JWT_SECRET === "saathislove") {
  console.warn("Warning: Using default JWT_SECRET. Please set a secure secret in your environment variables for production.");
}

// Middleware to verify JWT token and attach user to request
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token." });
    }
    req.user = user; // Attach decoded payload (e.g., { id: '...', type: '...' })
    next();
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize MongoDB connection once
  await connectDB();
  
  // ============ User (Patient) Routes ============
  
  // Register user
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { name, phoneNumber, password, emergencyContactName, emergencyContactPhone } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const existingUser = await DB.User.findOne({ phoneNumber });
      if (existingUser) {
        return res.status(400).json({ error: "Phone number already registered" });
      }

      // Create user document
      const user = await DB.User.create({
        name,
        phoneNumber,
        password: hashedPassword,
        emergencyContact: {
          name: emergencyContactName,
          phoneNumber: emergencyContactPhone
        }
      });

      const token = jwt.sign({ id: user._id, type: 'user', name: user.name }, JWT_SECRET);
      res.status(201).json({ user: { id: user._id, name: user.name, phoneNumber: user.phoneNumber }, token });

    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Login user
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { phoneNumber, password } = req.body;

      const user = await DB.User.findOne({ phoneNumber });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user._id, type: 'user', name: user.name }, JWT_SECRET);
      res.json({ user: { id: user._id, name: user.name, phoneNumber: user.phoneNumber }, token });

    } catch (error: any) {
      res.status(500).json({ error: "An internal server error occurred." });
    }
  });
  // Register hospital
  app.post("/api/hospital/register", async (req: Request, res: Response) => {
    try {
      const { name, email, password, address, phoneNumber } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const existingHospital = await DB.Hospital.findOne({ email });
      if (existingHospital) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const hospital = await DB.Hospital.create({ name, email, password: hashedPassword, address, phoneNumber });
      const token = jwt.sign({ id: hospital._id, type: 'hospital', name: hospital.name }, JWT_SECRET);
      res.status(201).json({ hospital: { id: hospital._id, name: hospital.name, email: hospital.email }, token });

    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Login hospital
  app.post("/api/hospital/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const hospital = await DB.Hospital.findOne({ email });
      if (!hospital || !(await bcrypt.compare(password, hospital.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign({ id: hospital._id, type: 'hospital', name: hospital.name }, JWT_SECRET);
      res.json({ hospital: { id: hospital._id, name: hospital.name, email: hospital.email }, token });
    } catch (error: any) {
        res.status(500).json({ error: "An internal server error occurred." });
    }
  });
  // Register doctor (can be done by a hospital)
  app.post("/api/doctor/register", async (req: Request, res: Response) => {
    try {
      const { name, email, password, specialization, hospitalId, phoneNumber } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const existingDoctor = await DB.Doctor.findOne({ email });
      if (existingDoctor) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const doctor = await DB.Doctor.create({ name, email, password: hashedPassword, specialization, hospitalId, phoneNumber });
      const token = jwt.sign({ id: doctor._id, type: 'doctor', name: doctor.name }, JWT_SECRET);
      res.status(201).json({ doctor: { id: doctor._id, name: doctor.name, email: doctor.email }, token });

    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Login doctor
  app.post("/api/doctor/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      const doctor = await DB.Doctor.findOne({ email });
      if (!doctor || !(await bcrypt.compare(password, doctor.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign({ id: doctor._id, type: 'doctor', name: doctor.name }, JWT_SECRET);
      res.json({ doctor: { id: doctor._id, name: doctor.name, email: doctor.email, specialization: doctor.specialization }, token });

    } catch (error: any) {
      res.status(500).json({ error: "An internal server error occurred." });
    }
  });

  // Get online doctors
  app.get("/api/doctors/online", async (req: Request, res: Response) => {
    try {
      const doctors = await DB.Doctor.find({ isOnline: true });
      res.json(doctors);
    } catch (error: any) {
      res.status(500).json({ error: "Could not fetch doctors." });
    }
  });
  
  app.post("/api/posts", authenticateToken, async (req: Request, res: Response) => {
    try {
      const { content } = req.body;
      const { id: authorId, name: authorName } = req.user!; // Get user info from token

      if (!content || !authorId || !authorName) {
        return res.status(400).json({ error: "Missing required post data" });
      }
      
      const post = await DB.Post.create({ content, authorId, authorName });
      res.status(201).json(post);

    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/posts", async (req: Request, res: Response) => {
    try {
      // Fetch posts sorted by creation date, newest first
      const posts = await DB.Post.find();
      res.json(posts);
    } catch (error: any) {
      res.status(500).json({ error: "Could not fetch posts." });
    }
  });
  // Create chat room
  app.post("/api/chat/room", authenticateToken, async (req: Request, res: Response) => {
    try {
      const { userId, doctorId } = req.body;
      const chatRoom = await DB.ChatRoom.create({ userId, doctorId });
      res.status(201).json(chatRoom);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get chat rooms for a user
  app.get("/api/chat/rooms/user/:userId", authenticateToken, async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const rooms = await DB.ChatRoom.find({ userId });
      res.json(rooms);
    } catch (error: any) {
      res.status(500).json({ error: "Could not fetch chat rooms." });
    }
  });

  // Get chat rooms for a doctor
  app.get("/api/chat/rooms/doctor/:doctorId", authenticateToken, async (req: Request, res: Response) => {
    try {
      const { doctorId } = req.params;
      const rooms = await DB.ChatRoom.find({ doctorId });
      res.json(rooms);
    } catch (error: any) {
      res.status(500).json({ error: "Could not fetch chat rooms." });
    }
  });

  // Get messages for a chat room
  app.get("/api/chat/messages/:chatRoomId", authenticateToken, async (req: Request, res: Response) => {
    try {
      const { chatRoomId } = req.params;
      const messages = await DB.ChatMessage.find({ chatRoomId });
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ error: "Could not fetch messages." });
    }
  });

  const httpServer = createServer(app);
  
  // Initialize Socket.IO for real-time chat
  const io = new SocketIOServer(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-room", (roomId: string) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on("send-message", async (data) => {
      try {
        const { chatRoomId, senderId, senderType, message } = data;
        const savedMessage = await DB.ChatMessage.create({ chatRoomId, senderId, senderType, message });
        io.to(chatRoomId).emit("receive-message", savedMessage);
      } catch (error) {
        console.error("Error saving/sending message:", error);
      }
    });

    socket.on("doctor-online", async (doctorId: string) => {
      await DB.Doctor.findByIdAndUpdate(doctorId, { isOnline: true });
      io.emit("doctor-status-change", { doctorId, isOnline: true });
    });

    socket.on("doctor-offline", async (doctorId: string) => {
      await DB.Doctor.findByIdAndUpdate(doctorId, { isOnline: false });
      io.emit("doctor-status-change", { doctorId, isOnline: false });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return httpServer;
}

