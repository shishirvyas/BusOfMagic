package com.magicbus.controller;

import com.magicbus.dto.workflow.*;
import com.magicbus.service.CandidateWorkflowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/screening")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class ScreeningController {

    private final CandidateWorkflowService workflowService;

    /**
     * Get all candidates with PENDING_SCREENING status
     */
    @GetMapping("/pending")
    public ResponseEntity<List<CandidateWorkflowDTO>> getPendingScreening() {
        return ResponseEntity.ok(workflowService.getPendingScreening());
    }

    /**
     * Get all candidates with PENDING_ORIENTATION status
     */
    @GetMapping("/pending-orientation")
    public ResponseEntity<List<CandidateWorkflowDTO>> getPendingOrientation() {
        return ResponseEntity.ok(workflowService.getPendingOrientation());
    }

    /**
     * Get all candidates with PENDING_ENROLL status
     */
    @GetMapping("/pending-enroll")
    public ResponseEntity<List<CandidateWorkflowDTO>> getPendingEnrollment() {
        return ResponseEntity.ok(workflowService.getPendingEnrollment());
    }

    /**
     * Get all enrolled candidates
     */
    @GetMapping("/enrolled")
    public ResponseEntity<List<CandidateWorkflowDTO>> getEnrolled() {
        return ResponseEntity.ok(workflowService.getEnrolled());
    }

    /**
     * Get workflow statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(workflowService.getWorkflowStats());
    }

    /**
     * Get workflow by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<CandidateWorkflowDTO> getWorkflowById(@PathVariable Long id) {
        return ResponseEntity.ok(workflowService.getWorkflowById(id));
    }

    /**
     * Get workflow by candidate ID
     */
    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<CandidateWorkflowDTO> getWorkflowByCandidateId(@PathVariable Long candidateId) {
        return ResponseEntity.ok(workflowService.getWorkflowByCandidateId(candidateId));
    }

    /**
     * Complete screening - move to PENDING_ORIENTATION
     */
    @PutMapping("/complete-screening")
    public ResponseEntity<CandidateWorkflowDTO> completeScreening(
            @RequestBody ScreeningUpdateRequest request,
            @RequestHeader("X-Admin-User-Id") Long adminUserId) {
        return ResponseEntity.ok(workflowService.completeScreening(request, adminUserId));
    }

    /**
     * Complete orientation - move to PENDING_ENROLL
     */
    @PutMapping("/complete-orientation")
    public ResponseEntity<CandidateWorkflowDTO> completeOrientation(
            @RequestBody OrientationUpdateRequest request,
            @RequestHeader("X-Admin-User-Id") Long adminUserId) {
        return ResponseEntity.ok(workflowService.completeOrientation(request, adminUserId));
    }

    /**
     * Enroll candidate in a training batch
     */
    @PutMapping("/enroll")
    public ResponseEntity<CandidateWorkflowDTO> enrollCandidate(
            @RequestBody EnrollmentRequest request,
            @RequestHeader("X-Admin-User-Id") Long adminUserId) {
        return ResponseEntity.ok(workflowService.enrollCandidate(request, adminUserId));
    }

    /**
     * Create workflow for existing candidate (manual trigger)
     */
    @PostMapping("/create-workflow/{candidateId}")
    public ResponseEntity<CandidateWorkflowDTO> createWorkflow(@PathVariable Long candidateId) {
        return ResponseEntity.ok(
            new CandidateWorkflowDTO() // Return basic info
        );
    }
}
