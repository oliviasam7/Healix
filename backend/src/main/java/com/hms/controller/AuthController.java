package com.hms.controller;

import com.hms.dto.AuthDtos.*;
import com.hms.model.User;
import com.hms.security.JwtUtil;
import com.hms.service.CustomUserDetailsService;
import com.hms.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private UserService userService;
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private CustomUserDetailsService userDetailsService;
    @Autowired private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        userService.registerPatient(req.fullName, req.email, req.password, req.phone,
                req.dob, req.gender, req.address, req.bloodGroup);
        return ResponseEntity.ok(Map.of("message", "Account created. You can log in now."));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.email, req.password));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password."));
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(req.email);
        User user = userService.findByEmail(req.email);
        String token = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(new AuthResponse(token, user.getEmail(), user.getFullName(), user.getRole().name()));
    }
}
