package com.hms.config;

import com.hms.model.*;
import com.hms.repository.AppointmentRepository;
import com.hms.repository.DoctorRepository;
import com.hms.repository.UserRepository;
import com.hms.service.MedicalRecordService;
import com.hms.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;

@Configuration
public class DataInitializer {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);
    private static final String DEMO_PASSWORD = "demo1234";

    /** Seeds admin account and comprehensive demo data on startup if not already present. */
    @Bean
    public CommandLineRunner initData(UserService userService,
                                      UserRepository userRepository,
                                      DoctorRepository doctorRepository,
                                      AppointmentRepository appointmentRepository,
                                      MedicalRecordService medicalRecordService) {
        return args -> {
            boolean seededAny = false;

            // 1. Seed Admin
            if (!userRepository.existsByEmail("admin@healix.com")) {
                userService.ensureAdminExists("admin@healix.com", "admin123");
                seededAny = true;
            }

            // 2. Seed 5 Doctors across different specializations with assigned rooms
            Doctor drSharma = getOrCreateDoctor(userService, userRepository, doctorRepository,
                    "Dr. Priya Sharma", "dr.sharma@healix.com", "9876543210",
                    "Cardiology", "MBBS, MD (Cardiology)", 12, 800.0,
                    "Mon, Wed, Fri", "09:00 AM - 01:00 PM", "Room 101");

            Doctor drPatel = getOrCreateDoctor(userService, userRepository, doctorRepository,
                    "Dr. Rajesh Patel", "dr.patel@healix.com", "9876543211",
                    "Dermatology", "MBBS, MD (Dermatology)", 8, 650.0,
                    "Tue, Thu, Sat", "10:00 AM - 02:00 PM", "Room 102");

            Doctor drIyer = getOrCreateDoctor(userService, userRepository, doctorRepository,
                    "Dr. Ananya Iyer", "dr.iyer@healix.com", "9876543212",
                    "Pediatrics", "MBBS, DCH, MD (Pediatrics)", 10, 600.0,
                    "Mon - Fri", "09:00 AM - 01:00 PM", "Room 103");

            Doctor drMalhotra = getOrCreateDoctor(userService, userRepository, doctorRepository,
                    "Dr. Vikram Malhotra", "dr.malhotra@healix.com", "9876543213",
                    "Orthopedics", "MBBS, MS (Ortho)", 15, 900.0,
                    "Mon, Tue, Thu", "02:00 PM - 06:00 PM", "Room 104");

            Doctor drReddy = getOrCreateDoctor(userService, userRepository, doctorRepository,
                    "Dr. Sneha Reddy", "dr.reddy@healix.com", "9876543214",
                    "General Medicine", "MBBS, MD (Internal Medicine)", 7, 500.0,
                    "Mon - Sat", "09:00 AM - 04:00 PM", "Room 105");

            // 3. Seed 4 Patients with full profile attributes
            Patient pRao = getOrCreatePatient(userService, userRepository,
                    "Rohan Rao", "patient.rao@healix.com", "9123456780",
                    "1990-05-14", "Male", "42 MG Road, Bengaluru, Karnataka", "O+");

            Patient pNair = getOrCreatePatient(userService, userRepository,
                    "Meera Nair", "patient.nair@healix.com", "9123456781",
                    "1985-11-22", "Female", "15 Park Street, Kolkata, West Bengal", "A+");

            Patient pVerma = getOrCreatePatient(userService, userRepository,
                    "Amit Verma", "patient.verma@healix.com", "9123456782",
                    "1998-03-08", "Male", "78 Nehru Nagar, Delhi", "B+");

            Patient pDesai = getOrCreatePatient(userService, userRepository,
                    "Kavita Desai", "patient.desai@healix.com", "9123456783",
                    "1994-09-30", "Female", "23 FC Road, Pune, Maharashtra", "AB+");

            // 4. Seed Appointments and Medical Records (only if no appointments exist yet)
            if (appointmentRepository.count() == 0) {
                LocalDate today = LocalDate.now();

                // 1) Completed appointment with MedicalRecord (Rao with Dr. Sharma)
                Appointment a1 = createAppointment(appointmentRepository, pRao, drSharma,
                        today.minusDays(5), "09:30 AM", "Routine cardiac checkup & ECG", AppointmentStatus.COMPLETED);
                medicalRecordService.create(a1,
                        "Mild essential hypertension, normal ECG",
                        "Tab. Telmisartan 40mg (1-0-0) x 30 days, Low sodium diet",
                        "Patient advised to reduce dietary salt and monitor BP daily in the morning.");

                // 2) Completed appointment with MedicalRecord (Nair with Dr. Patel)
                Appointment a2 = createAppointment(appointmentRepository, pNair, drPatel,
                        today.minusDays(3), "10:30 AM", "Allergic skin rash on arms", AppointmentStatus.COMPLETED);
                medicalRecordService.create(a2,
                        "Contact dermatitis (allergic reaction)",
                        "Tab. Cetirizine 10mg (0-0-1) x 7 days, Hydrocortisone 1% cream apply BID",
                        "Avoid suspected laundry detergent; review in clinic if rash persists past 1 week.");

                // 3) Completed appointment with MedicalRecord (Verma with Dr. Reddy)
                Appointment a3 = createAppointment(appointmentRepository, pVerma, drReddy,
                        today.minusDays(2), "11:00 AM", "Viral fever and body ache", AppointmentStatus.COMPLETED);
                medicalRecordService.create(a3,
                        "Acute viral upper respiratory tract infection",
                        "Tab. Paracetamol 650mg SOS, Vit C 500mg (1-0-0) x 5 days, Steam inhalation",
                        "Advised bed rest, hydration, and review if high fever persists > 3 days.");

                // 4) Confirmed appointment (Desai with Dr. Iyer)
                createAppointment(appointmentRepository, pDesai, drIyer,
                        today.plusDays(1), "10:00 AM", "Vaccination consultation & pediatric growth check", AppointmentStatus.CONFIRMED);

                // 5) Confirmed appointment (Rao with Dr. Malhotra)
                createAppointment(appointmentRepository, pRao, drMalhotra,
                        today.plusDays(2), "02:30 PM", "Chronic lower back pain after gym workouts", AppointmentStatus.CONFIRMED);

                // 6) Pending appointment (Nair with Dr. Reddy)
                createAppointment(appointmentRepository, pNair, drReddy,
                        today.plusDays(3), "09:30 AM", "Annual full-body wellness screening", AppointmentStatus.PENDING);

                // 7) Pending appointment (Verma with Dr. Sharma)
                createAppointment(appointmentRepository, pVerma, drSharma,
                        today.plusDays(4), "11:30 AM", "Occasional palpitations during running", AppointmentStatus.PENDING);

                // 8) Cancelled appointment (Desai with Dr. Patel)
                createAppointment(appointmentRepository, pDesai, drPatel,
                        today.minusDays(1), "11:00 AM", "Acne consultation", AppointmentStatus.CANCELLED);

                seededAny = true;
            }

            // Log demo credentials to console on initial seeding
            if (seededAny) {
                logSeededCredentials();
            }
        };
    }

    private Doctor getOrCreateDoctor(UserService userService, UserRepository userRepository, DoctorRepository doctorRepository,
                                     String name, String email, String phone,
                                     String specialization, String qualification, int exp,
                                     double fee, String days, String timeSlots, String room) {
        if (!userRepository.existsByEmail(email)) {
            return userService.registerDoctor(name, email, DEMO_PASSWORD, phone,
                    specialization, qualification, exp, fee, days, timeSlots, room);
        }
        User user = userService.findByEmail(email);
        Doctor doctor = userService.getDoctorForUser(user);
        // Backfill room if null from a previous run
        if (doctor.getRoom() == null && room != null) {
            doctor.setRoom(room);
            doctor = doctorRepository.save(doctor);
        }
        return doctor;
    }

    private Patient getOrCreatePatient(UserService userService, UserRepository userRepository,
                                       String name, String email, String phone,
                                       String dob, String gender, String address, String bloodGroup) {
        if (!userRepository.existsByEmail(email)) {
            User user = userService.registerPatient(name, email, DEMO_PASSWORD, phone,
                    dob, gender, address, bloodGroup);
            return userService.getPatientForUser(user);
        }
        User user = userService.findByEmail(email);
        return userService.getPatientForUser(user);
    }

    private Appointment createAppointment(AppointmentRepository repo, Patient patient, Doctor doctor,
                                          LocalDate date, String time, String reason, AppointmentStatus status) {
        Appointment a = new Appointment();
        a.setPatient(patient);
        a.setDoctor(doctor);
        a.setAppointmentDate(date);
        a.setAppointmentTime(time);
        a.setReason(reason);
        a.setStatus(status);
        return repo.save(a);
    }

    private void logSeededCredentials() {
        log.info("\n" +
                "========================================================================================\n" +
                "                           HEALIX HEALTHOS — DEMO DATA INITIALIZED                     \n" +
                "========================================================================================\n" +
                " Admin Account:\n" +
                "   • admin@healix.com                | Password: admin123\n\n" +
                " Doctor Accounts (Demo Password: " + DEMO_PASSWORD + "):\n" +
                "   • dr.sharma@healix.com           | Cardiology        | Room 101 | Dr. Priya Sharma\n" +
                "   • dr.patel@healix.com            | Dermatology       | Room 102 | Dr. Rajesh Patel\n" +
                "   • dr.iyer@healix.com             | Pediatrics        | Room 103 | Dr. Ananya Iyer\n" +
                "   • dr.malhotra@healix.com         | Orthopedics       | Room 104 | Dr. Vikram Malhotra\n" +
                "   • dr.reddy@healix.com            | General Medicine  | Room 105 | Dr. Sneha Reddy\n\n" +
                " Patient Accounts (Demo Password: " + DEMO_PASSWORD + "):\n" +
                "   • patient.rao@healix.com         | Rohan Rao\n" +
                "   • patient.nair@healix.com        | Meera Nair\n" +
                "   • patient.verma@healix.com       | Amit Verma\n" +
                "   • patient.desai@healix.com       | Kavita Desai\n" +
                "========================================================================================");
    }
}
