package com.hms.dto;

public class RequestDtos {

    public static class BookAppointmentRequest {
        public String date;
        public String time;
        public String reason;
    }

    public static class CompleteAppointmentRequest {
        public String diagnosis;
        public String prescription;
        public String notes;
    }

    public static class AddDoctorRequest {
        public String fullName;
        public String email;
        public String password;
        public String phone;
        public String specialization;
        public String qualification;
        public int experienceYears;
        public double consultationFee;
        public String availableDays;
        public String availableTimeSlots;
    }
}
