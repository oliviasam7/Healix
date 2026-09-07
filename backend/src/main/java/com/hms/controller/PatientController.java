package com.hms.controller;

import com.hms.dto.*;
import com.hms.dto.RequestDtos.BookAppointmentRequest;
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

    @GetMapping("/appointments")
    public List<AppointmentDto> myAppointments(Authentication auth) {
        return appointmentService.findForPatient(currentPatient(auth)).stream()
                .map(AppointmentDto::from).collect(Collectors.toList());
    }

    @PostMapping("/appointments/{doctorId}")
    public ResponseEntity<?> book(@PathVariable Long doctorId,
                                   @RequestBody BookAppointmentRequest req,
                                   Authentication auth) {
        Patient patient = currentPatient(auth);
        Doctor doctor = doctorService.findById(doctorId);
        Appointment appointment = appointmentService.book(patient, doctor, LocalDate.parse(req.date), req.time, req.reason);
        return ResponseEntity.ok(AppointmentDto.from(appointment));
    }

    @PostMapping("/appointments/{id}/cancel")
    public ResponseEntity<?> cancel(@PathVariable Long id) {
        appointmentService.updateStatus(id, AppointmentStatus.CANCELLED);
        return ResponseEntity.ok(Map.of("message", "Appointment cancelled."));
    }

    @GetMapping("/records")
    public List<MedicalRecordDto> records(Authentication auth) {
        return medicalRecordService.findForPatient(currentPatient(auth)).stream()
                .map(MedicalRecordDto::from).collect(Collectors.toList());
    }
}
