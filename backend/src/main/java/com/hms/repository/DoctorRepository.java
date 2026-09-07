package com.hms.repository;

import com.hms.model.Doctor;
import com.hms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByUser(User user);
    Optional<Doctor> findByUserId(Long userId);
    java.util.List<Doctor> findBySpecializationContainingIgnoreCase(String specialization);
}
