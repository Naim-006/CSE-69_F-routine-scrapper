
import { ClassSession, Teacher, RoutineMetadata, CRInfo } from './types';

export const METADATA: RoutineMetadata = {
  batch: "69",
  section: "F",
  totalCourses: 6,
  version: "8.0 Premium",
  classesPerWeek: 14,
  lastUpdated: new Date().toLocaleDateString()
};

export const CR_DATA: CRInfo = {
  name: "Not yet assigned",
  id: "252-15-XXXX",
  phone: "+880 1700-000000",
  email: "",
  photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sakib",
  whatsapp: "https://wa.me/8801700000000"
};

export const TEACHERS: Teacher[] = [
  {
    id: '1',
    name: 'A.A. Rahman',
    initial: 'AAR',
    photo: 'https://i.pravatar.cc/150?u=aar',
    isActive: true,
    designation: 'Assistant Professor',
    email: 'aar@diu.edu.bd'
  },
  {
    id: '2',
    name: 'R.K. Roy',
    initial: 'RKR',
    photo: 'https://i.pravatar.cc/150?u=rkr',
    isActive: true,
    designation: 'Lecturer',
    email: 'rkr@diu.edu.bd'
  },
  {
    id: '3',
    name: 'E.H. Limon',
    initial: 'EHL',
    photo: 'https://i.pravatar.cc/150?u=ehl',
    isActive: true,
    designation: 'Senior Lecturer',
    email: 'ehl@diu.edu.bd'
  },
];

export const DEFAULT_ROUTINE: ClassSession[] = [
  {
    id: '1',
    subject: 'Physics - II',
    code: 'PHY102',
    teacher: 'A.A. Rahman',
    teacherInitial: 'AAR',
    startTime: '08:30',
    endTime: '10:00',
    room: 'KT-219',
    day: 'Sunday',
    section: '69_F',
    type: 'Lecture',
    credits: 3
  },
  {
    id: '2',
    subject: 'Data Structure',
    code: 'CSE123',
    teacher: 'R.K. Roy',
    teacherInitial: 'RKR',
    startTime: '10:00',
    endTime: '11:30',
    room: 'KT-802',
    day: 'Sunday',
    section: '69_F',
    type: 'Lecture',
    credits: 3
  },
  {
    id: '3',
    subject: 'Physics - II Lab',
    code: 'PHY103',
    teacher: 'A.A. Rahman',
    teacherInitial: 'AAR',
    startTime: '13:00',
    endTime: '14:30',
    room: 'KT-219',
    day: 'Sunday',
    section: '69_F',
    subSection: 'F1',
    type: 'Lab',
    credits: 1.5
  },
  {
    id: '4',
    subject: 'Physics - II Lab',
    code: 'PHY103',
    teacher: 'A.A. Rahman',
    teacherInitial: 'AAR',
    startTime: '14:30',
    endTime: '16:00',
    room: 'KT-219',
    day: 'Sunday',
    section: '69_F',
    subSection: 'F2',
    type: 'Lab',
    credits: 1.5
  },
  {
    id: '5',
    subject: 'Mathematics III',
    code: 'MAT201',
    teacher: 'Dr. S. Khan',
    teacherInitial: 'SK',
    startTime: '08:30',
    endTime: '10:00',
    room: 'AB4-201',
    day: 'Monday',
    section: '69_F',
    type: 'Lecture',
    credits: 3
  }
];
