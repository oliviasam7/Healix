package com.hms.dto;

import com.hms.model.MedicalRecord;

public class MedicalRecordDto {
    public Long id;
    public String doctorName;
    public String specialization;
    public String diagnosis;
    public String prescription;
    public String notes;
    public String recordDate;

    public static MedicalRecordDto from(MedicalRecord r) {
        MedicalRecordDto dto = new MedicalRecordDto();
        dto.id = r.getId();
        dto.doctorName = r.getDoctor().getUser().getFullName();
        dto.specialization = r.getDoctor().getSpecialization();
        dto.diagnosis = r.getDiagnosis();
        dto.prescription = r.getPrescription();
        dto.notes = r.getNotes();
        dto.recordDate = r.getRecordDate().toString();
        return dto;
    }
}
