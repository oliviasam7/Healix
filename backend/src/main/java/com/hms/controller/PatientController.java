package com.hms.controller;

import com.hms.dto.*;
import com.hms.dto.RequestDtos.BookAppointmentRequest;
import com.hms.model.*;
import com.hms.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/patient")
public class PatientController {

    @Autowired private UserService userService;
    @Autowired private DoctorService doctorService;
    @Autowired private AppointmentService appointmentService;
    @Autowired private MedicalRecordService medicalRecordService;

    private Patient currentPatient(Authentication auth) {
        User user = userService.findByEmail(auth.getName());
        return userService.getPatientForUser(user);
    }

    @GetMapping("/me")
    public PatientDto me(Authentication auth) {
        return PatientDto.from(currentPatient(auth));
    }

    @GetMapping("/doctors")
    public List<DoctorDto> browseDoctors(@RequestParam(required = false) String specialization) {
        return doctorService.searchBySpecialization(specialization).stream()
                .map(DoctorDto::from).collect(Collectors.toList());
    }

    @GetMapping("/doctors/{doctorId}/booked-slots")
    public ResponseEntity<?> getBookedSlots(@PathVariable Long doctorId,
                                            @RequestParam(required = false) String date) {
        if (date == null || date.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing required date parameter. Expected format: YYYY-MM-DD."));
        }
        LocalDate parsedDate;
        try {
            parsedDate = LocalDate.parse(date.trim());
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid date format '" + date + "'. Expected format: YYYY-MM-DD."));
        }

        Doctor doctor;
        try {
            doctor = doctorService.findById(doctorId);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Doctor not found with ID: " + doctorId));
        }

        List<String> bookedSlots = appointmentService.getBookedSlots(doctor, parsedDate);
        return ResponseEntity.ok(bookedSlots);
    }

    @GetMapping("/appointments")
    public List<AppointmentDto> myAppointments(Authentication auth) {
        return appointmentService.findForPatient(currentPatient(auth)).stream()
                .map(AppointmentDto::from).collect(Collectors.toList());
    }

    @PostMapping("/appointments/{doctorId}")
    public ResponseEntity<?> book(@PathVariable Long doctorId,
                                   @RequestBody BookAppointmentRequest req,
                                   Authentication auth) {
        if (req.date == null || req.date.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Appointment date is required (format: YYYY-MM-DD)."));
        }
        LocalDate parsedDate;
        try {
            parsedDate = LocalDate.parse(req.date.trim());
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid appointment date format. Expected format: YYYY-MM-DD."));
        }

        Patient patient = currentPatient(auth);
        Doctor doctor;
        try {
            doctor = doctorService.findById(doctorId);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Doctor not found with ID: " + doctorId));
        }

        Appointment appointment = appointmentService.book(patient, doctor, parsedDate, req.time, req.reason);
        return ResponseEntity.ok(AppointmentDto.from(appointment));
    }

    @PostMapping("/appointments/{id}/cancel")
    public ResponseEntity<?> cancel(@PathVariable Long id, Authentication auth) {
        Appointment appointment = appointmentService.findById(id);
        Patient patient = currentPatient(auth);
        if (appointment.getPatient() == null || !appointment.getPatient().getId().equals(patient.getId())) {
            return ResponseEntity.status(403).body(Map.of("error", "You don't have access to this appointment."));
        }
        appointmentService.updateStatus(id, AppointmentStatus.CANCELLED);
        return ResponseEntity.ok(Map.of("message", "Appointment cancelled."));
    }

    @GetMapping("/records")
    public List<MedicalRecordDto> records(Authentication auth) {
        return medicalRecordService.findForPatient(currentPatient(auth)).stream()
                .map(MedicalRecordDto::from).collect(Collectors.toList());
    }
}
