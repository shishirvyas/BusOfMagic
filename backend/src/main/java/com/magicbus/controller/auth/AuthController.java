package com.magicbus.controller.auth;

import com.magicbus.dto.auth.*;
import com.magicbus.service.auth.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(LoginResponse.builder()
                    .message(e.getMessage())
                    .build());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        // In a real app with JWT, you'd invalidate the token here
        return ResponseEntity.ok(Map.of("message", "Logout successful"));
    }

    @GetMapping("/validate")
    public ResponseEntity<Map<String, Boolean>> validateSession(
            @RequestHeader(value = "Authorization", required = false) String token) {
        // Simple validation - in production, verify JWT token
        boolean isValid = token != null && !token.isEmpty();
        return ResponseEntity.ok(Map.of("valid", isValid));
    }
}
