package com.hms.controller;

import com.hms.dto.AppointmentDto;
import com.hms.dto.RequestDtos.CompleteAppointmentRequest;
import com.hms.model.*;
import com.hms.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/doctor")
public class DoctorController {

    @Autowired private UserService userService;
    @Autowired private AppointmentService appointmentService;
    @Autowired private MedicalRecordService medicalRecordService;

    private Doctor currentDoctor(Authentication auth) {
        User user = userService.findByEmail(auth.getName());
        return userService.getDoctorForUser(user);
    }

    @GetMapping("/appointments")
    public List<AppointmentDto> myAppointments(Authentication auth) {
        return appointmentService.findForDoctor(currentDoctor(auth)).stream()
                .map(AppointmentDto::from).collect(Collectors.toList());
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
