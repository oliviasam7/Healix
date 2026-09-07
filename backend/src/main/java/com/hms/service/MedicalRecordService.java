package com.hms.service;

import com.hms.model.*;
import com.hms.repository.MedicalRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicalRecordService {

    @Autowired private MedicalRecordRepository medicalRecordRepository;

    public MedicalRecord create(Appointment appointment, String diagnosis, String prescription, String notes) {
        MedicalRecord record = new MedicalRecord();
        record.setAppointment(appointment);
        record.setPatient(appointment.getPatient());
        record.setDoctor(appointment.getDoctor());
        record.setDiagnosis(diagnosis);
        record.setPrescription(prescription);
        record.setNotes(notes);
        return medicalRecordRepository.save(record);
    }

    public List<MedicalRecord> findForPatient(Patient patient) {
        return medicalRecordRepository.findByPatientOrderByRecordDateDesc(patient);
    }
}
