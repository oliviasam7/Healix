export type Role = 'PATIENT' | 'DOCTOR' | 'ADMIN';

export interface AuthUser {
  email: string;
  fullName: string;
  role: Role;
}

export interface DoctorDto {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  specialization: string;
  qualification: string;
  experienceYears: number;
  consultationFee: number;
  availableDays: string;
  availableTimeSlots: string;
}

export interface PatientDto {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  bloodGroup: string;
}

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface AppointmentDto {
  id: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  specialization: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  status: AppointmentStatus;
}

export interface MedicalRecordDto {
  id: number;
  doctorName: string;
  specialization: string;
  diagnosis: string;
  prescription: string;
  notes: string;
  recordDate: string;
}
