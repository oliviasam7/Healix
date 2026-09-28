package com.hms.controller;

import com.hms.dto.*;
import com.hms.dto.RequestDtos.CompleteAppointmentRequest;
import com.hms.dto.RequestDtos.UpdateDoctorProfileRequest;
import com.hms.model.*;
import com.hms.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/doctor")
public class DoctorController {

    @Autowired private UserService userService;
    @Autowired private DoctorService doctorService;
    @Autowired private AppointmentService appointmentService;
    @Autowired private MedicalRecordService medicalRecordService;

    private Doctor currentDoctor(Authentication auth) {
        User user = userService.findByEmail(auth.getName());
        return userService.getDoctorForUser(user);
    }

    @GetMapping("/me")
    public DoctorDto me(Authentication auth) {
        return DoctorDto.from(currentDoctor(auth));
    }

    @PutMapping("/profile")
    public DoctorDto updateProfile(@RequestBody UpdateDoctorProfileRequest req, Authentication auth) {
        Doctor doctor = currentDoctor(auth);
        User user = doctor.getUser();

        if (req.fullName != null && !req.fullName.isBlank()) user.setFullName(req.fullName.trim());
        if (req.phone != null) user.setPhone(req.phone.trim());
        if (req.specialization != null) doctor.setSpecialization(req.specialization.trim());
        if (req.qualification != null) doctor.setQualification(req.qualification.trim());
        if (req.experienceYears != null) doctor.setExperienceYears(req.experienceYears);
        if (req.consultationFee != null) doctor.setConsultationFee(req.consultationFee);
        if (req.availableDays != null) doctor.setAvailableDays(req.availableDays.trim());
        if (req.availableTimeSlots != null) doctor.setAvailableTimeSlots(req.availableTimeSlots.trim());
        if (req.room != null) doctor.setRoom(req.room.trim());

        return DoctorDto.from(doctorService.save(doctor));
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats(Authentication auth) {
        Doctor doctor = currentDoctor(auth);
        List<Appointment> appointments = appointmentService.findForDoctor(doctor);
        LocalDate today = LocalDate.now();

        long totalAppointments = appointments.size();
        long todayAppointments = appointments.stream()
                .filter(a -> a.getAppointmentDate() != null && a.getAppointmentDate().equals(today))
                .count();
        long completedCount = appointments.stream()
                .filter(a -> a.getStatus() == AppointmentStatus.COMPLETED)
                .count();
        double totalEarnings = completedCount * doctor.getConsultationFee();

        return ResponseEntity.ok(Map.of(
                "totalAppointments", totalAppointments,
                "todayAppointments", todayAppointments,
                "completedConsultations", completedCount,
                "totalEarnings", totalEarnings
        ));
    }

    @GetMapping("/appointments")
    public List<AppointmentDto> myAppointments(Authentication auth) {
        return appointmentService.findForDoctor(currentDoctor(auth)).stream()
                .map(AppointmentDto::from).collect(Collectors.toList());
    }

    @GetMapping("/patients")
    public List<PatientDto> allPatients() {
        return userService.findAllPatients().stream().map(PatientDto::from).collect(Collectors.toList());
    }

    @GetMapping("/patients/{patientId}/records")
    public List<MedicalRecordDto> getPatientRecords(@PathVariable Long patientId) {
        Patient patient = new Patient();
        patient.setId(patientId);
        return medicalRecordService.findForPatient(patient).stream()
                .map(MedicalRecordDto::from).collect(Collectors.toList());
    }

    @PostMapping("/appointments/{id}/confirm")
    public ResponseEntity<?> confirm(@PathVariable Long id, Authentication auth) {
        Appointment appointment = appointmentService.findById(id);
        Doctor doctor = currentDoctor(auth);
        if (appointment.getDoctor() == null || !appointment.getDoctor().getId().equals(doctor.getId())) {
            return ResponseEntity.status(403).body(Map.of("error", "You don't have access to this appointment."));
        }
        appointmentService.updateStatus(id, AppointmentStatus.CONFIRMED);
        return ResponseEntity.ok(Map.of("message", "Appointment confirmed."));
    }

    @PostMapping("/appointments/{id}/cancel")
    public ResponseEntity<?> cancel(@PathVariable Long id, Authentication auth) {
        Appointment appointment = appointmentService.findById(id);
        Doctor doctor = currentDoctor(auth);
        if (appointment.getDoctor() == null || !appointment.getDoctor().getId().equals(doctor.getId())) {
            return ResponseEntity.status(403).body(Map.of("error", "You don't have access to this appointment."));
        }
        appointmentService.updateStatus(id, AppointmentStatus.CANCELLED);
        return ResponseEntity.ok(Map.of("message", "Appointment cancelled."));
    }

    @PostMapping("/appointments/{id}/complete")
    public ResponseEntity<?> complete(@PathVariable Long id, @RequestBody CompleteAppointmentRequest req, Authentication auth) {
        Appointment appointment = appointmentService.findById(id);
        Doctor doctor = currentDoctor(auth);
        if (appointment.getDoctor() == null || !appointment.getDoctor().getId().equals(doctor.getId())) {
            return ResponseEntity.status(403).body(Map.of("error", "You don't have access to this appointment."));
        }
        medicalRecordService.create(appointment, req.diagnosis, req.prescription, req.notes);
        appointmentService.updateStatus(id, AppointmentStatus.COMPLETED);
        return ResponseEntity.ok(Map.of("message", "Consultation recorded."));
    }
}
