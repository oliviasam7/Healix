package com.hms.service;

import com.hms.model.Doctor;
import com.hms.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorService {

    @Autowired private DoctorRepository doctorRepository;

    public List<Doctor> findAll() {
        return doctorRepository.findAll();
    }

    public List<Doctor> searchBySpecialization(String query) {
        if (query == null || query.isBlank()) return findAll();
        return doctorRepository.findBySpecializationContainingIgnoreCase(query);
    }

    public Doctor findById(Long id) {
        return doctorRepository.findById(id).orElseThrow(() ->
                new IllegalArgumentException("Doctor not found."));
    }
}
