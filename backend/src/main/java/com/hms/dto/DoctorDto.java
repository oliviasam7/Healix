package com.hms.dto;

import com.hms.model.Doctor;

public class DoctorDto {
    public Long id;
    public String fullName;
    public String email;
    public String phone;
    public String specialization;
    public String qualification;
    public int experienceYears;
    public double consultationFee;
    public String availableDays;
    public String availableTimeSlots;

    public static DoctorDto from(Doctor d) {
        DoctorDto dto = new DoctorDto();
        dto.id = d.getId();
        dto.fullName = d.getUser().getFullName();
        dto.email = d.getUser().getEmail();
        dto.phone = d.getUser().getPhone();
        dto.specialization = d.getSpecialization();
        dto.qualification = d.getQualification();
        dto.experienceYears = d.getExperienceYears();
        dto.consultationFee = d.getConsultationFee();
        dto.availableDays = d.getAvailableDays();
        dto.availableTimeSlots = d.getAvailableTimeSlots();
        return dto;
    }
}
