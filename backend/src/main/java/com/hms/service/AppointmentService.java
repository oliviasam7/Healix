package com.hms.service;

import com.hms.model.*;
import com.hms.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    @Autowired private AppointmentRepository appointmentRepository;

    private static final DateTimeFormatter OUTPUT_TIME_FORMATTER = DateTimeFormatter.ofPattern("hh:mm a", Locale.ENGLISH);

    private static final DateTimeFormatter[] TIME_PARSERS = new DateTimeFormatter[] {
        new DateTimeFormatterBuilder().parseCaseInsensitive().appendPattern("h:mm a").toFormatter(Locale.ENGLISH),
        new DateTimeFormatterBuilder().parseCaseInsensitive().appendPattern("hh:mm a").toFormatter(Locale.ENGLISH),
        new DateTimeFormatterBuilder().parseCaseInsensitive().appendPattern("h:m a").toFormatter(Locale.ENGLISH),
        new DateTimeFormatterBuilder().parseCaseInsensitive().appendPattern("H:mm").toFormatter(Locale.ENGLISH),
        new DateTimeFormatterBuilder().parseCaseInsensitive().appendPattern("HH:mm").toFormatter(Locale.ENGLISH),
        new DateTimeFormatterBuilder().parseCaseInsensitive().appendPattern("H:mm:ss").toFormatter(Locale.ENGLISH),
        new DateTimeFormatterBuilder().parseCaseInsensitive().appendPattern("HH:mm:ss").toFormatter(Locale.ENGLISH),
        new DateTimeFormatterBuilder().parseCaseInsensitive().appendPattern("h a").toFormatter(Locale.ENGLISH),
        new DateTimeFormatterBuilder().parseCaseInsensitive().appendPattern("ha").toFormatter(Locale.ENGLISH)
    };

    public static String normalizeTime(String rawTime) {
        if (rawTime == null || rawTime.trim().isEmpty()) {
            throw new IllegalArgumentException("Appointment time is required.");
        }
        String trimmed = rawTime.trim().replaceAll("\\s+", " ").toUpperCase(Locale.ENGLISH);
        trimmed = trimmed.replaceAll("(?<=\\d)(AM|PM)", " $1");

        for (DateTimeFormatter formatter : TIME_PARSERS) {
            try {
                LocalTime time = LocalTime.parse(trimmed, formatter);
                return time.format(OUTPUT_TIME_FORMATTER);
            } catch (DateTimeParseException ignored) {}
        }
        throw new IllegalArgumentException("Invalid appointment time format: '" + rawTime + "'. Expected format e.g. '09:30 AM'.");
    }

    public List<String> getBookedSlots(Doctor doctor, LocalDate date) {
        return appointmentRepository.findByDoctorAndAppointmentDateAndStatusNot(doctor, date, AppointmentStatus.CANCELLED)
                .stream()
                .map(Appointment::getAppointmentTime)
                .distinct()
                .collect(Collectors.toList());
    }

    public Appointment book(Patient patient, Doctor doctor, LocalDate date, String time, String reason) {
        String normalizedTime = normalizeTime(time);
        boolean slotTaken = appointmentRepository.findByDoctorAndAppointmentDateAndStatusNot(doctor, date, AppointmentStatus.CANCELLED)
                .stream()
                .anyMatch(a -> a.getAppointmentTime().equalsIgnoreCase(normalizedTime));
        if (slotTaken) {
            throw new IllegalStateException("That slot is already booked. Please choose another time.");
        }

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(date);
        appointment.setAppointmentTime(normalizedTime);
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
