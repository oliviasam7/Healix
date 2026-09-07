package com.hms.service;

import com.hms.model.*;
import com.hms.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AppointmentService {

    @Autowired private AppointmentRepository appointmentRepository;

    public Appointment book(Patient patient, Doctor doctor, LocalDate date, String time, String reason) {
        boolean slotTaken = appointmentRepository.findByDoctorAndAppointmentDate(doctor, date)
                .stream()
                .anyMatch(a -> a.getAppointmentTime().equals(time)
                        && a.getStatus() != AppointmentStatus.CANCELLED);
        if (slotTaken) {
            throw new IllegalStateException("That slot is already booked. Please choose another time.");
        }

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(date);
        appointment.setAppointmentTime(time);
        appointment.setReason(reason);
        appointment.setStatus(AppointmentStatus.PENDING);
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> findForPatient(Patient patient) {
        return appointmentRepository.findByPatientOrderByAppointmentDateDesc(patient);
    }

    public List<Appointment> findForDoctor(Doctor doctor) {
        return appointmentRepository.findByDoctorOrderByAppointmentDateDesc(doctor);
    }

    public List<Appointment> findAll() {
        return appointmentRepository.findAllByOrderByAppointmentDateDesc();
    }

    public Appointment findById(Long id) {
        return appointmentRepository.findById(id).orElseThrow(() ->
                new IllegalArgumentException("Appointment not found."));
    }

    public Appointment updateStatus(Long id, AppointmentStatus status) {
        Appointment appointment = findById(id);
        appointment.setStatus(status);
        return appointmentRepository.save(appointment);
    }
}
