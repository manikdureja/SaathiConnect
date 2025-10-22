import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI environment variable is not set');
  process.exit(1);
}

let useInMemoryDB = false;

// ===============================
// MongoDB Connection Logic
// ===============================
export async function connectDB() {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('MongoDB already connected');
      return;
    }

    // MONGODB_URI is validated above; assert non-null for TS
    await mongoose.connect(MONGODB_URI as string, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log('MongoDB connected successfully');
    useInMemoryDB = false;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Using in-memory storage as fallback');
    useInMemoryDB = true;
  }
}

export function isMongoDBConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export function shouldUseInMemoryDB(): boolean {
  return useInMemoryDB;
}

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

// ===============================
// Patient Schema & Model
// ===============================
interface IPatient {
  id: string;
  name: string;
  age: number;
  height: number;
  weight: number;
  bmi: number;
  bloodGroup: string;
  createdAt?: Date;
}

// Mongo Schema (only used if MongoDB is connected)
const patientSchema = new mongoose.Schema<IPatient>(
  {
    id: { type: String, required: true, unique: true },
    name: String,
    age: Number,
    height: Number,
    weight: Number,
    bmi: Number,
    bloodGroup: String,
    createdAt: { type: Date, default: Date.now },
  },
  { collection: 'patients' }
);

const PatientModel =
  mongoose.models.Patient || mongoose.model<IPatient>('Patient', patientSchema);

// ===============================
// In-memory fallback
// ===============================
const memoryPatients: Record<string, IPatient> = {};

// ===============================
// Helper functions
// ===============================
export async function createPatient(data: IPatient): Promise<IPatient> {
  if (shouldUseInMemoryDB()) {
    memoryPatients[data.id] = data;
    return data;
  } else {
    const patient = new PatientModel(data);
    await patient.save();
    return patient.toObject();
  }
}

export async function getPatientById(id: string): Promise<IPatient | null> {
  if (shouldUseInMemoryDB()) {
    return memoryPatients[id] || null;
  }
  else {
    const patient = await PatientModel.findOne({ id }).lean().exec();
    return patient as unknown as IPatient | null;
  }
}
