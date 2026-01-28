package com.magicbus.controller;

import com.magicbus.dto.OnboardingRequestDTO;
import com.magicbus.dto.OnboardingResponseDTO;
import com.magicbus.dto.SignupRequestDTO;
import com.magicbus.entity.Candidate;
import com.magicbus.repository.CandidateRepository;
import com.magicbus.service.OnboardingService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/candidates")
@CrossOrigin(origins = "*")
public class CandidateController {

    private final OnboardingService onboardingService;
    private final CandidateRepository candidateRepository;

    public CandidateController(
            OnboardingService onboardingService,
            CandidateRepository candidateRepository) {
        this.onboardingService = onboardingService;
        this.candidateRepository = candidateRepository;
    }

    /**
     * Individual candidate signup with basic details and DOB
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signupCandidate(@RequestBody SignupRequestDTO request) {
        try {
            log.info("Received individual signup request");
            log.info("Full Name: {}", request.getFullName());
            log.info("Date of Birth: {}", request.getDateOfBirth());
            log.info("Contact Type: {}", request.getContactType());
            if ("email".equals(request.getContactType())) {
                log.info("Email: {}", request.getEmail());
            } else {
                log.info("Mobile: {}", request.getMobile());
            }

            // For now, just logging the data as per requirement
            // In future, we can save this to database
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Signup data received successfully");
            response.put("fullName", request.getFullName());
            response.put("dateOfBirth", request.getDateOfBirth());
            response.put("contactType", request.getContactType());

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            log.error("Error in signup: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Onboard a new candidate with personal, education, and skills information
     */
    @PostMapping("/onboard")
    public ResponseEntity<?> onboardCandidate(@RequestBody OnboardingRequestDTO request) {
        try {
            log.info("Received onboarding request for: {} {}", request.getFirstName(), request.getLastName());
            
            OnboardingResponseDTO response = onboardingService.onboardCandidate(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            log.error("Error in onboarding: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Get all candidates
     */
    @GetMapping
    public ResponseEntity<List<Candidate>> getAllCandidates() {
        try {
            List<Candidate> candidates = candidateRepository.findAll();
            return ResponseEntity.ok(candidates);
        } catch (Exception e) {
            log.error("Error fetching candidates: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get candidate by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getCandidateById(@PathVariable Long id) {
        try {
            Optional<Candidate> candidate = candidateRepository.findById(id);
            if (candidate.isPresent()) {
                return ResponseEntity.ok(candidate.get());
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Candidate not found"));
        } catch (Exception e) {
            log.error("Error fetching candidate: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get all active candidates
     */
    @GetMapping("/active")
    public ResponseEntity<List<Candidate>> getActiveCandidates() {
        try {
            List<Candidate> candidates = candidateRepository.findAllActiveCandidates();
            return ResponseEntity.ok(candidates);
        } catch (Exception e) {
            log.error("Error fetching active candidates: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get candidates at risk of dropout
     */
    @GetMapping("/at-risk")
    public ResponseEntity<List<Candidate>> getAtRiskCandidates(
            @RequestParam(defaultValue = "50") Integer riskThreshold) {
        try {
            List<Candidate> candidates = candidateRepository.findAtRiskCandidates(riskThreshold);
            return ResponseEntity.ok(candidates);
        } catch (Exception e) {
            log.error("Error fetching at-risk candidates: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get candidates by city and state
     */
    @GetMapping("/location")
    public ResponseEntity<List<Candidate>> getCandidatesByLocation(
            @RequestParam String city,
            @RequestParam String state) {
        try {
            List<Candidate> candidates = candidateRepository.findByCityAndState(city, state);
            return ResponseEntity.ok(candidates);
        } catch (Exception e) {
            log.error("Error fetching candidates by location: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get candidate statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getCandidateStats() {
        try {
            List<Candidate> allCandidates = candidateRepository.findAll();
            List<Candidate> activeCandidates = candidateRepository.findAllActiveCandidates();
            List<Candidate> atRiskCandidates = candidateRepository.findAtRiskCandidates(50);

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalCandidates", allCandidates.size());
            stats.put("activeCandidates", activeCandidates.size());
            stats.put("atRiskCandidates", atRiskCandidates.size());

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Error fetching candidate stats: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
