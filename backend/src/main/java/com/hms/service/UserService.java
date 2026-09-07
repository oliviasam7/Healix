package com.hms.service;

import com.hms.model.*;
import com.hms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired private UserRepository userRepository;
    @Autowired private PatientRepository patientRepository;
    @Autowired private DoctorRepository doctorRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    /** Self-registration is always as PATIENT. Admin creates DOCTOR/ADMIN accounts separately. */
    public User registerPatient(String fullName, String email, String rawPassword, String phone,
                                 String dob, String gender, String address, String bloodGroup) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("An account with this email already exists.");
        }
        User user = new User(fullName, email, passwordEncoder.encode(rawPassword), phone, Role.PATIENT);
        user = userRepository.save(user);

        Patient patient = new Patient();
        patient.setUser(user);
        patient.setDateOfBirth(dob);
        patient.setGender(gender);
        patient.setAddress(address);
        patient.setBloodGroup(bloodGroup);
        patientRepository.save(patient);

        return user;
    }

    public Doctor registerDoctor(String fullName, String email, String rawPassword, String phone,
                                  String specialization, String qualification, int experienceYears,
                                  double fee, String availableDays, String availableTimeSlots) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("An account with this email already exists.");
        }
        User user = new User(fullName, email, passwordEncoder.encode(rawPassword), phone, Role.DOCTOR);
        user = userRepository.save(user);

        Doctor doctor = new Doctor();
        doctor.setUser(user);
        doctor.setSpecialization(specialization);
        doctor.setQualification(qualification);
        doctor.setExperienceYears(experienceYears);
        doctor.setConsultationFee(fee);
        doctor.setAvailableDays(availableDays);
        doctor.setAvailableTimeSlots(availableTimeSlots);
        return doctorRepository.save(doctor);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() ->
                new IllegalArgumentException("No user found for " + email));
    }

    public Patient getPatientForUser(User user) {
        return patientRepository.findByUser(user).orElseThrow(() ->
                new IllegalStateException("No patient profile found."));
    }

    public Doctor getDoctorForUser(User user) {
        return doctorRepository.findByUser(user).orElseThrow(() ->
                new IllegalStateException("No doctor profile found."));
    }

    public void ensureAdminExists(String email, String rawPassword) {
        if (!userRepository.existsByEmail(email)) {
            User admin = new User("System Admin", email, passwordEncoder.encode(rawPassword), "0000000000", Role.ADMIN);
            userRepository.save(admin);
        }
    }
}
