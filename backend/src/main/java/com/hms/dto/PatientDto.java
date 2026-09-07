package com.hms.dto;

import com.hms.model.Patient;

public class PatientDto {
    public Long id;
    public String fullName;
    public String email;
    public String phone;
    public String dateOfBirth;
    public String gender;
    public String address;
    public String bloodGroup;

    public static PatientDto from(Patient p) {
        PatientDto dto = new PatientDto();
        dto.id = p.getId();
        dto.fullName = p.getUser().getFullName();
        dto.email = p.getUser().getEmail();
        dto.phone = p.getUser().getPhone();
        dto.dateOfBirth = p.getDateOfBirth();
        dto.gender = p.getGender();
        dto.address = p.getAddress();
        dto.bloodGroup = p.getBloodGroup();
        return dto;
    }
}
