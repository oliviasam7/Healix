package com.hms.controller;

import com.hms.dto.AppointmentDto;
import com.hms.dto.DoctorDto;
import com.hms.dto.RequestDtos.AddDoctorRequest;
import com.hms.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired private UserService userService;
    @Autowired private DoctorService doctorService;
    @Autowired private AppointmentService appointmentService;

    @GetMapping("/doctors")
    public List<DoctorDto> allDoctors() {
        return doctorService.findAll().stream().map(DoctorDto::from).collect(Collectors.toList());
    }

    @PostMapping("/doctors")
    public DoctorDto addDoctor(@RequestBody AddDoctorRequest req) {
        var doctor = userService.registerDoctor(req.fullName, req.email, req.password, req.phone,
                req.specialization, req.qualification, req.experienceYears, req.consultationFee,
                req.availableDays, req.availableTimeSlots);
        return DoctorDto.from(doctor);
    }

    @GetMapping("/appointments")
    public List<AppointmentDto> allAppointments() {
        return appointmentService.findAll().stream().map(AppointmentDto::from).collect(Collectors.toList());
    }
}
