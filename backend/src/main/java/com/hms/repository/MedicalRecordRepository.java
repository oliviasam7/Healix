package com.hms.repository;

import com.hms.model.MedicalRecord;
import com.hms.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    List<MedicalRecord> findByPatientOrderByRecordDateDesc(Patient patient);
    Optional<MedicalRecord> findByAppointmentId(Long appointmentId);
}
