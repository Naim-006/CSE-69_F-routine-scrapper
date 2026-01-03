
export interface Teacher {
  id: string;
  name: string;
  initial: string;
  photo: string;
  isActive: boolean;
  email?: string;
  designation?: string;
}

export interface CRInfo {
  name: string;
  id: string;
  phone: string;
  email: string;
  photo: string;
  whatsapp: string;
}

export interface ClassSession {
  id: string;
  subject: string;
  code: string;
  teacher: string;
  teacherInitial: string;
  teacherPhoto?: string;
  startTime: string; // HH:mm format (24h)
  endTime: string;   // HH:mm format (24h)
  room: string;
  day: DayOfWeek;
  section: string;
  subSection?: string; // e.g. "F1" or "F2"
  type?: 'Lecture' | 'Lab' | 'Workshop';
  credits?: number;
}

export type DayOfWeek = 'Saturday' | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export const DAYS: DayOfWeek[] = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export interface RoutineMetadata {
  batch: string;
  section: string;
  totalCourses: number;
  version: string;
  classesPerWeek: number;
  lastUpdated: string;
  welcomeMsg?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
