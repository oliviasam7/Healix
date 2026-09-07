package com.hms.repository;

import com.hms.model.Appointment;
import com.hms.model.Doctor;
import com.hms.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientOrderByAppointmentDateDesc(Patient patient);
    List<Appointment> findByDoctorOrderByAppointmentDateDesc(Doctor doctor);
    List<Appointment> findByDoctorAndAppointmentDate(Doctor doctor, LocalDate date);
    List<Appointment> findAllByOrderByAppointmentDateDesc();
}
