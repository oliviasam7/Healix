package com.hms.config;

import com.hms.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    /** Creates a default admin account on first startup: admin@healix.com / admin123 */
    @Bean
    public CommandLineRunner initAdmin(UserService userService) {
        return args -> userService.ensureAdminExists("admin@healix.com", "admin123");
    }
}
