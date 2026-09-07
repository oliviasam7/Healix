package com.hms.dto;

import com.hms.model.Appointment;

public class AppointmentDto {
    public Long id;
    public Long patientId;
    public String patientName;
    public Long doctorId;
    public String doctorName;
    public String specialization;
    public String appointmentDate;
    public String appointmentTime;
    public String reason;
    public String status;

    public static AppointmentDto from(Appointment a) {
        AppointmentDto dto = new AppointmentDto();
        dto.id = a.getId();
        dto.patientId = a.getPatient().getId();
        dto.patientName = a.getPatient().getUser().getFullName();
        dto.doctorId = a.getDoctor().getId();
        dto.doctorName = a.getDoctor().getUser().getFullName();
        dto.specialization = a.getDoctor().getSpecialization();
        dto.appointmentDate = a.getAppointmentDate().toString();
        dto.appointmentTime = a.getAppointmentTime();
        dto.reason = a.getReason();
        dto.status = a.getStatus().name();
        return dto;
    }
}
