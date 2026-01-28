package com.magicbus.controller;

import com.magicbus.dto.*;
import com.magicbus.service.SignupService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/signup")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:3001", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class SignupController {
    
    private final SignupService signupService;
    
    /**
     * Step 1: Send OTP to email or phone
     * POST /api/signup/send-otp
     */
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody SendOtpRequest request) {
        try {
            log.info("Received OTP request for: {}", request.getContact());
            
            // Validate input
            if (request.getContact() == null || request.getContact().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Contact is required"));
            }
            
            if (request.getContactType() == null || request.getContactType().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Contact type is required (EMAIL or PHONE)"));
            }
            
            // Send OTP
            String otpCode = signupService.sendOtp(request);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "OTP sent successfully");
            response.put("otpCode", otpCode);  // For testing only - REMOVE IN PRODUCTION
            response.put("expiryMinutes", 10);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error sending OTP", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Failed to send OTP: " + e.getMessage()));
        }
    }
    
    /**
     * Step 2: Verify OTP
     * POST /api/signup/verify-otp
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest request) {
        try {
            log.info("Verifying OTP for: {}", request.getContact());
            
            // Validate input
            if (request.getContact() == null || request.getContact().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Contact is required"));
            }
            
            if (request.getOtpCode() == null || request.getOtpCode().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("OTP code is required"));
            }
            
            // Verify OTP
            Long candidateId = signupService.verifyOtp(request);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "OTP verified successfully");
            response.put("candidateId", candidateId);
            response.put("nextStep", "personal-details");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error verifying OTP", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(createErrorResponse("OTP verification failed: " + e.getMessage()));
        }
    }
    
    /**
     * Step 2.5: Save Profile Details (Name and DOB)
     * POST /api/signup/profile-details
     */
    @PostMapping("/profile-details")
    public ResponseEntity<?> saveProfileDetails(@RequestBody ProfileDetailsDto dto) {
        try {
            log.info("Saving profile details for candidate: {}", dto.getCandidateId());
            
            // Validate input
            if (dto.getCandidateId() == null) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Candidate ID is required"));
            }
            
            if (dto.getFirstName() == null || dto.getFirstName().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("First name is required"));
            }
            
            if (dto.getLastName() == null || dto.getLastName().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Last name is required"));
            }
            
            if (dto.getDateOfBirth() == null) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Date of birth is required"));
            }
            
            signupService.saveProfileDetails(dto);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Profile details saved successfully");
            response.put("candidateId", dto.getCandidateId());
            response.put("nextStep", "personal-details");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error saving profile details", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Failed to save profile details: " + e.getMessage()));
        }
    }
    
    /**
     * Step 3: Save Personal Details
     * POST /api/signup/personal-details
     */
    @PostMapping("/personal-details")
    public ResponseEntity<?> savePersonalDetails(@RequestBody PersonalDetailsDto dto) {
        try {
            log.info("Saving personal details for candidate: {}", dto.getCandidateId());
            
            // Validate input
            if (dto.getCandidateId() == null) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Candidate ID is required"));
            }
            
            signupService.savePersonalDetails(dto);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Personal details saved successfully");
            response.put("candidateId", dto.getCandidateId());
            response.put("nextStep", "education-details");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error saving personal details", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Failed to save personal details: " + e.getMessage()));
        }
    }
    
    /**
     * Step 4: Save Education Details
     * POST /api/signup/education-details
     */
    @PostMapping("/education-details")
    public ResponseEntity<?> saveEducationDetails(@RequestBody EducationDetailsDto dto) {
        try {
            log.info("Saving education details for candidate: {}", dto.getCandidateId());
            
            // Validate input
            if (dto.getCandidateId() == null) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Candidate ID is required"));
            }
            
            signupService.saveEducationDetails(dto);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Education details saved successfully");
            response.put("candidateId", dto.getCandidateId());
            response.put("nextStep", "skills");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error saving education details", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Failed to save education details: " + e.getMessage()));
        }
    }
    
    /**
     * Step 5: Save Skills and Languages
     * POST /api/signup/skills
     */
    @PostMapping("/skills")
    public ResponseEntity<?> saveSkillsAndLanguages(@RequestBody SkillsAndLanguagesDto dto) {
        try {
            log.info("Saving skills and languages for candidate: {}", dto.getCandidateId());
            
            // Validate input
            if (dto.getCandidateId() == null) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Candidate ID is required"));
            }
            
            signupService.saveSkillsAndLanguages(dto);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Skills and languages saved successfully");
            response.put("candidateId", dto.getCandidateId());
            response.put("nextStep", "review");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error saving skills and languages", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Failed to save skills and languages: " + e.getMessage()));
        }
    }
    
    /**
     * Step 6: Complete Signup
     * POST /api/signup/complete
     */
    @PostMapping("/complete")
    public ResponseEntity<?> completeSignup(@RequestParam Long candidateId) {
        try {
            log.info("Completing signup for candidate: {}", candidateId);
            
            // Validate input
            if (candidateId == null || candidateId <= 0) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Valid candidate ID is required"));
            }
            
            signupService.completeSignup(candidateId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Signup completed successfully");
            response.put("candidateId", candidateId);
            response.put("status", "COMPLETE");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error completing signup", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Failed to complete signup: " + e.getMessage()));
        }
    }
    
    /**
     * Helper method to create error response
     */
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("message", message);
        return error;
    }
}
