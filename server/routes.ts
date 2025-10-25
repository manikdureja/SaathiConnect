import type { Express, Request, Response, NextFunction } from "express";
import QRCode from "qrcode";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { DB } from "./dbAbstraction"; // Your DB abstraction layer
import { authenticateToken } from "./authMiddleware"; // JWT middleware
import { config } from './config';

const JWT_SECRET = config.jwt.secret;

if (!JWT_SECRET || JWT_SECRET === 'saathi-development-secret') {
  console.warn(
    "Warning: Using a default or missing JWT secret. For production, set a secure secret in the environment or .jwt_secret file."
  );
}

export async function registerRoutes(app: Express) {
  // =======================
  // User / Patient Routes
  // =======================

  // Register user
  const multer = (await import('multer')).default;
  const path = (await import('path'));
  const fs = (await import('fs'));

  const uploadsDir = path.resolve(process.cwd(), 'server', 'uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
      const unique = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
      const ext = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${unique}${ext}`);
    }
  });

  const upload = multer({ storage });

  // serve uploads statically
  app.use('/uploads', (await import('express')).static(uploadsDir));

  app.post("/api/auth/register", upload.array('reportFiles'), async (req: Request, res: Response) => {
    try {
      const { name, phoneNumber, password, emergencyContactName, emergencyContactPhone, height, weight, bmi, bloodGroup, photoUrl, qrCodeId } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const existingUser = await DB.User.findOne({ phoneNumber });
      if (existingUser) return res.status(400).json({ error: "Phone number already registered" });

      // Handle uploaded report files (if disk storage used)
      let medicalReports: any[] = [];
      if (req.files && Array.isArray(req.files)) {
        const host = req.get('host');
        const proto = req.protocol;
        medicalReports = req.files.map((file: any) => ({
          title: file.originalname,
          url: `${proto}://${host}/uploads/${file.filename}`,
          uploadedAt: new Date(),
          type: 'Report',
        }));
      }

      // Ensure a unique qrCodeId exists for the user (DB requires it)
      const generatedQrCodeId = qrCodeId || (Date.now().toString(36) + Math.random().toString(36).slice(2, 10));

      const user = await DB.User.create({
        name,
        phoneNumber,
        password: hashedPassword,
        emergencyContact: { name: emergencyContactName, phoneNumber: emergencyContactPhone },
        height,
        weight,
        bmi,
        bloodGroup,
        photoUrl,
        qrCodeId: generatedQrCodeId,
        medicalReports,
      });

      // Generate QR code for the user
      const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
      const qrData = `${frontendURL}/scan/${user.qrCodeId}`;
      const qrCode = await (await import('qrcode')).default.toDataURL(qrData);

      const token = jwt.sign({ id: user._id, type: "user", name: user.name }, JWT_SECRET);
      res.status(201).json({ user: { id: user._id, name: user.name, phoneNumber: user.phoneNumber }, token, qrCode });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
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

      const token = jwt.sign({ id: user._id, type: "user", name: user.name }, JWT_SECRET);
      res.json({ user: { id: user._id, name: user.name, phoneNumber: user.phoneNumber }, token });
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // =======================
  // Hospital Routes
  // =======================

  // Register hospital
  app.post("/api/hospital/register", async (req: Request, res: Response) => {
    try {
      const { name, email, password, address, phoneNumber } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const existingHospital = await DB.Hospital.findOne({ email });
      if (existingHospital) return res.status(400).json({ error: "Email already registered" });

      const hospital = await DB.Hospital.create({ name, email, password: hashedPassword, address, phoneNumber });
      const token = jwt.sign({ id: hospital._id, type: "hospital", name: hospital.name }, JWT_SECRET);
      res.status(201).json({ hospital: { id: hospital._id, name: hospital.name, email: hospital.email }, token });
    } catch (err: any) {
      console.error('Hospital register error:', err);
      const message = err?.message || 'Unknown error';
      res.status(400).json({ error: message });
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

      const token = jwt.sign({ id: hospital._id, type: "hospital", name: hospital.name }, JWT_SECRET);
      res.json({ hospital: { id: hospital._id, name: hospital.name, email: hospital.email }, token });
    } catch (err: any) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // =======================
  // Doctor Routes
  // =======================

  // Register doctor
  app.post("/api/doctor/register", async (req: Request, res: Response) => {
    try {
      const { name, email, password, specialization, hospitalId, phoneNumber } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const existingDoctor = await DB.Doctor.findOne({ email });
      if (existingDoctor) return res.status(400).json({ error: "Email already registered" });

      const doctor = await DB.Doctor.create({ name, email, password: hashedPassword, specialization, hospitalId, phoneNumber });
      const token = jwt.sign({ id: doctor._id, type: "doctor", name: doctor.name }, JWT_SECRET);
      res.status(201).json({ doctor: { id: doctor._id, name: doctor.name, email: doctor.email }, token });
    } catch (err: any) {
      console.error('Doctor register error:', err);
      const message = err?.message || 'Unknown error';
      res.status(400).json({ error: message });
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

      const token = jwt.sign({ id: doctor._id, type: "doctor", name: doctor.name }, JWT_SECRET);
      res.json({ doctor: { id: doctor._id, name: doctor.name, email: doctor.email, specialization: doctor.specialization }, token });
    } catch (err: any) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get online doctors
  app.get("/api/doctors/online", async (req: Request, res: Response) => {
    try {
      const doctors = await DB.Doctor.find({ isOnline: true });
      res.json(doctors);
    } catch (err: any) {
      res.status(500).json({ error: "Could not fetch doctors." });
    }
  });

  // Get all doctors for a hospital
  app.get('/api/hospital/:id/doctors', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const doctors = await DB.Doctor.findByHospital(id);
      res.json(doctors);
    } catch (err: any) {
      console.error('Error fetching hospital doctors:', err);
      res.status(500).json({ error: 'Could not fetch hospital doctors' });
    }
  });

  // Update doctor profile (name, photoUrl, bloodGroup, reports)
  app.put('/api/doctor/:id/profile', authenticateToken, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, photoUrl, bloodGroup, reports } = req.body;

      const doctor = await DB.Doctor.findById(id);
      if (!doctor) return res.status(404).json({ error: 'Doctor not found' });

      const updated = await DB.Doctor.update(id, {
        ...(name ? { name } : {}),
        ...(photoUrl ? { photoUrl } : {}),
        ...(bloodGroup ? { bloodGroup } : {}),
        ...(reports ? { reports } : {}),
      } as any);

      res.json({ message: 'Profile updated', doctor: updated });
    } catch (err: any) {
      console.error('Error updating doctor profile:', err);
      res.status(500).json({ error: 'Could not update profile' });
    }
  });

  // =======================
  // Posts Routes
  // =======================

  app.post("/api/posts", authenticateToken, async (req: Request, res: Response) => {
    try {
      const { content } = req.body;
      const { id: authorId, name: authorName } = req.user!;
      if (!content) return res.status(400).json({ error: "Content is required" });

  const post = await DB.Post.create({ content, authorId: authorId as any, authorName });
      res.status(201).json(post);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.get("/api/posts", async (req: Request, res: Response) => {
    try {
      const posts = await DB.Post.find();
      res.json(posts);
    } catch (err: any) {
      res.status(500).json({ error: "Could not fetch posts." });
    }
  });

  // =======================
  // Chat Routes
  // =======================

  app.post("/api/chat/room", authenticateToken, async (req: Request, res: Response) => {
    try {
      const { userId, doctorId } = req.body;
      const room = await DB.ChatRoom.create({ userId, doctorId });
      res.status(201).json(room);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.get("/api/chat/rooms/user/:userId", authenticateToken, async (req: Request, res: Response) => {
    const { userId } = req.params;
    const rooms = await DB.ChatRoom.find({ userId: userId as any });
    res.json(rooms);
  });

  app.get("/api/chat/rooms/doctor/:doctorId", authenticateToken, async (req: Request, res: Response) => {
    const { doctorId } = req.params;
    const rooms = await DB.ChatRoom.find({ doctorId: doctorId as any });
    res.json(rooms);
  });

  app.get("/api/chat/messages/:chatRoomId", authenticateToken, async (req: Request, res: Response) => {
    const { chatRoomId } = req.params;
    const messages = await DB.ChatMessage.find({ chatRoomId });
    res.json(messages);
  });

  // =======================
  // QR Code / Medical Reports
  // =======================

  // Get user by id
  app.get('/api/user/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await DB.User.findById(id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (err: any) {
      console.error('Get user error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Update user profile
  // Accept multipart for photo upload
  app.put('/api/user/:id/profile', authenticateToken, upload.single('photo'), async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      // if multipart, photo may be in req.file; other fields in req.body
  const { name, photoUrl: photoUrlBody, bloodGroup, emergencyContactName, emergencyContactPhone, height, weight, bmi, majorProblem, allergies, chronicConditions, currentMedications } = req.body;
      let photoUrl = photoUrlBody;
      if ((req as any).file) {
        const file = (req as any).file;
        const host = req.get('host');
        const proto = req.protocol;
        photoUrl = `${proto}://${host}/uploads/${file.filename}`;
      }
      const user = await DB.User.findById(id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const updatePayload: any = {
        ...(name ? { name } : {}),
        ...(photoUrl ? { photoUrl } : {}),
        ...(bloodGroup ? { bloodGroup } : {}),
      };

      if (height !== undefined) updatePayload.height = Number(height);
      if (weight !== undefined) updatePayload.weight = Number(weight);
      if (bmi !== undefined) updatePayload.bmi = Number(bmi);
      if (majorProblem !== undefined) updatePayload.majorProblem = majorProblem;

      // Normalize allergy/condition/medication fields to arrays
      const parseList = (v: any) => {
        if (!v) return undefined;
        if (Array.isArray(v)) return v;
        try {
          // sometimes client may send JSON string
          const parsed = JSON.parse(v);
          if (Array.isArray(parsed)) return parsed;
        } catch (e) {
          // not JSON
        }
        // fallback: split by newlines or commas
        if (typeof v === 'string') {
          return v.split(/\r?\n|,\s*/).map((s: string) => s.trim()).filter(Boolean);
        }
        return undefined;
      };

      const parsedAllergies = parseList(allergies);
      const parsedChronic = parseList(chronicConditions);
      const parsedMeds = parseList(currentMedications);

      if (parsedAllergies !== undefined) updatePayload.allergies = parsedAllergies;
      if (parsedChronic !== undefined) updatePayload.chronicConditions = parsedChronic;
      if (parsedMeds !== undefined) updatePayload.currentMedications = parsedMeds;

      if (emergencyContactName || emergencyContactPhone) {
        updatePayload.emergencyContact = {
          name: emergencyContactName || user.emergencyContact?.name,
          phoneNumber: emergencyContactPhone || user.emergencyContact?.phoneNumber,
        };
      }

  if (photoUrl) updatePayload.photoUrl = photoUrl;
  const updated = await DB.User.update(id, updatePayload as any);

      res.json(updated);
    } catch (err: any) {
      console.error('Update user profile error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Get doctor by id
  app.get('/api/doctor/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const doctor = await DB.Doctor.findById(id);
      if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
      res.json(doctor);
    } catch (err: any) {
      console.error('Get doctor error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Fetch patient info by QR code
  app.get("/api/qr/:qrCodeId", async (req: Request, res: Response) => {
    try {
      const { qrCodeId } = req.params;
      const user = await DB.User.findOne({ qrCodeId });
      if (!user) return res.status(404).json({ message: "User not found" });

      res.json({
        name: user.name,
        height: user.height,
        weight: user.weight,
        bmi: user.bmi,
        bloodGroup: user.bloodGroup,
        emergencyContact: user.emergencyContact,
        medicalReports: user.medicalReports,
      });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Add medical report to patient
  app.post("/api/user/:id/report", authenticateToken, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { title, url } = req.body;
      if (!title || !url) return res.status(400).json({ message: "Missing report title or URL" });

      const user = await DB.User.findById(id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const newReport = { title, url, uploadedAt: new Date(), uploadedBy: (req.user as any)?.name || 'unknown', type: 'Report' };
  const updatedUser = await DB.User.update(id, { medicalReports: [...(user.medicalReports || []), newReport] } as any);

  if (!updatedUser) return res.status(500).json({ message: 'Failed to update user' });
  res.json({ message: "Report added successfully", medicalReports: updatedUser.medicalReports });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Generate QR code image for user
  app.get("/api/user/:id/qrcode", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await DB.User.findById(id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
      const qrData = `${frontendURL}/scan/${user.qrCodeId}`;
      const qrImage = await QRCode.toDataURL(qrData);

      res.json({ qrImage });
    } catch (err) {
      console.error('QR generation error:', err);
      const message = (err as any)?.message || 'QR generation failed';
      res.status(500).json({ message });
    }
  });
}
