package com.magicbus.service;

import com.magicbus.dto.workflow.*;
import com.magicbus.entity.Candidate;
import com.magicbus.entity.auth.AdminUser;
import com.magicbus.entity.training.TrainingBatch;
import com.magicbus.entity.workflow.CandidateWorkflow;
import com.magicbus.entity.workflow.WorkflowStatus;
import com.magicbus.repository.CandidateRepository;
import com.magicbus.repository.auth.AdminUserRepository;
import com.magicbus.repository.training.TrainingBatchRepository;
import com.magicbus.repository.workflow.CandidateWorkflowRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CandidateWorkflowService {

    private final CandidateWorkflowRepository workflowRepository;
    private final CandidateRepository candidateRepository;
    private final AdminUserRepository adminUserRepository;
    private final TrainingBatchRepository batchRepository;

    /**
     * Create workflow entry for a new candidate
     */
    @Transactional
    public CandidateWorkflow createWorkflowForCandidate(Long candidateId) {
        if (workflowRepository.existsByCandidateId(candidateId)) {
            log.warn("Workflow already exists for candidate: {}", candidateId);
            return workflowRepository.findByCandidateId(candidateId).orElse(null);
        }

        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found: " + candidateId));

        CandidateWorkflow workflow = CandidateWorkflow.builder()
                .candidate(candidate)
                .status(WorkflowStatus.PENDING_SCREENING)
                .build();

        workflow = workflowRepository.save(workflow);
        log.info("Created workflow for candidate: {} with status: {}", candidateId, workflow.getStatus());
        return workflow;
    }

    /**
     * Get all candidates with PENDING_SCREENING status
     */
    public List<CandidateWorkflowDTO> getPendingScreening() {
        return workflowRepository.findByStatusWithCandidate(WorkflowStatus.PENDING_SCREENING)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get all candidates with PENDING_ORIENTATION status
     */
    public List<CandidateWorkflowDTO> getPendingOrientation() {
        return workflowRepository.findByStatusWithCandidate(WorkflowStatus.PENDING_ORIENTATION)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get all candidates with PENDING_ENROLL status
     */
    public List<CandidateWorkflowDTO> getPendingEnrollment() {
        return workflowRepository.findByStatusWithCandidateAndBatch(WorkflowStatus.PENDING_ENROLL)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get all enrolled candidates
     */
    public List<CandidateWorkflowDTO> getEnrolled() {
        return workflowRepository.findByStatusWithCandidateAndBatch(WorkflowStatus.ENROLLED)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Complete screening - move to PENDING_ORIENTATION
     */
    @Transactional
    public CandidateWorkflowDTO completeScreening(ScreeningUpdateRequest request, Long adminUserId) {
        CandidateWorkflow workflow = workflowRepository.findById(request.getCandidateWorkflowId())
                .orElseThrow(() -> new RuntimeException("Workflow not found: " + request.getCandidateWorkflowId()));

        if (workflow.getStatus() != WorkflowStatus.PENDING_SCREENING) {
            throw new RuntimeException("Invalid status transition. Current status: " + workflow.getStatus());
        }

        AdminUser admin = adminUserRepository.findById(adminUserId)
                .orElseThrow(() -> new RuntimeException("Admin user not found: " + adminUserId));

        workflow.setScreeningCompletedAt(LocalDateTime.now());
        workflow.setScreeningCompletedBy(admin);
        workflow.setScreeningNotes(request.getNotes());

        if (request.isApproved()) {
            workflow.setStatus(WorkflowStatus.PENDING_ORIENTATION);
            log.info("Candidate {} moved to PENDING_ORIENTATION by admin {}", 
                    workflow.getCandidate().getId(), adminUserId);
        } else {
            workflow.setStatus(WorkflowStatus.ON_HOLD);
            log.info("Candidate {} put ON_HOLD by admin {}", 
                    workflow.getCandidate().getId(), adminUserId);
        }

        workflow = workflowRepository.save(workflow);
        return toDTO(workflow);
    }

    /**
     * Complete orientation - move to PENDING_ENROLL
     */
    @Transactional
    public CandidateWorkflowDTO completeOrientation(OrientationUpdateRequest request, Long adminUserId) {
        CandidateWorkflow workflow = workflowRepository.findById(request.getCandidateWorkflowId())
                .orElseThrow(() -> new RuntimeException("Workflow not found: " + request.getCandidateWorkflowId()));

        if (workflow.getStatus() != WorkflowStatus.PENDING_ORIENTATION) {
            throw new RuntimeException("Invalid status transition. Current status: " + workflow.getStatus());
        }

        AdminUser admin = adminUserRepository.findById(adminUserId)
                .orElseThrow(() -> new RuntimeException("Admin user not found: " + adminUserId));

        workflow.setOrientationCompletedAt(LocalDateTime.now());
        workflow.setOrientationCompletedBy(admin);
        workflow.setOrientationNotes(request.getNotes());

        if (request.isCompleted()) {
            workflow.setStatus(WorkflowStatus.PENDING_ENROLL);
            log.info("Candidate {} moved to PENDING_ENROLL by admin {}", 
                    workflow.getCandidate().getId(), adminUserId);
        }

        workflow = workflowRepository.save(workflow);
        return toDTO(workflow);
    }

    /**
     * Enroll candidate in a training batch
     */
    @Transactional
    public CandidateWorkflowDTO enrollCandidate(EnrollmentRequest request, Long adminUserId) {
        CandidateWorkflow workflow = workflowRepository.findById(request.getCandidateWorkflowId())
                .orElseThrow(() -> new RuntimeException("Workflow not found: " + request.getCandidateWorkflowId()));

        if (workflow.getStatus() != WorkflowStatus.PENDING_ENROLL) {
            throw new RuntimeException("Invalid status transition. Current status: " + workflow.getStatus());
        }

        TrainingBatch batch = batchRepository.findById(request.getTrainingBatchId())
                .orElseThrow(() -> new RuntimeException("Training batch not found: " + request.getTrainingBatchId()));

        if (!batch.hasCapacity()) {
            throw new RuntimeException("Training batch is full. No available slots.");
        }

        AdminUser admin = adminUserRepository.findById(adminUserId)
                .orElseThrow(() -> new RuntimeException("Admin user not found: " + adminUserId));

        // Update workflow
        workflow.setEnrolledAt(LocalDateTime.now());
        workflow.setEnrolledBy(admin);
        workflow.setTrainingBatch(batch);
        workflow.setEnrollmentNotes(request.getNotes());
        workflow.setStatus(WorkflowStatus.ENROLLED);

        // Update batch enrollment count
        batch.setCurrentEnrolled(batch.getCurrentEnrolled() + 1);
        batchRepository.save(batch);

        workflow = workflowRepository.save(workflow);
        log.info("Candidate {} enrolled in batch {} by admin {}", 
                workflow.getCandidate().getId(), batch.getBatchCode(), adminUserId);

        return toDTO(workflow);
    }

    /**
     * Get workflow by ID
     */
    public CandidateWorkflowDTO getWorkflowById(Long id) {
        CandidateWorkflow workflow = workflowRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workflow not found: " + id));
        return toDTO(workflow);
    }

    /**
     * Get workflow by candidate ID
     */
    public CandidateWorkflowDTO getWorkflowByCandidateId(Long candidateId) {
        CandidateWorkflow workflow = workflowRepository.findByCandidateId(candidateId)
                .orElseThrow(() -> new RuntimeException("Workflow not found for candidate: " + candidateId));
        return toDTO(workflow);
    }

    /**
     * Get workflow statistics
     */
    public Map<String, Long> getWorkflowStats() {
        return Map.of(
            "pendingScreening", workflowRepository.countByStatus(WorkflowStatus.PENDING_SCREENING),
            "pendingOrientation", workflowRepository.countByStatus(WorkflowStatus.PENDING_ORIENTATION),
            "pendingEnroll", workflowRepository.countByStatus(WorkflowStatus.PENDING_ENROLL),
            "enrolled", workflowRepository.countByStatus(WorkflowStatus.ENROLLED),
            "onHold", workflowRepository.countByStatus(WorkflowStatus.ON_HOLD)
        );
    }

    /**
     * Convert entity to DTO
     */
    private CandidateWorkflowDTO toDTO(CandidateWorkflow workflow) {
        Candidate candidate = workflow.getCandidate();
        TrainingBatch batch = workflow.getTrainingBatch();

        return CandidateWorkflowDTO.builder()
                .id(workflow.getId())
                .candidateId(candidate.getId())
                .firstName(candidate.getFirstName())
                .lastName(candidate.getLastName())
                .email(candidate.getEmail())
                .phoneNumber(candidate.getPhoneNumber())
                .dateOfBirth(candidate.getDateOfBirth())
                .city(candidate.getCity())
                .state(candidate.getState())
                .gender(candidate.getGender())
                .engagementScore(candidate.getEngagementScore())
                .dropoutRiskScore(candidate.getDropoutRiskScore())
                .status(workflow.getStatus())
                .statusDisplayName(workflow.getStatus().getDisplayName())
                .screeningCompletedAt(workflow.getScreeningCompletedAt())
                .screeningCompletedByName(workflow.getScreeningCompletedBy() != null ? 
                        workflow.getScreeningCompletedBy().getFirstName() + " " + workflow.getScreeningCompletedBy().getLastName() : null)
                .screeningNotes(workflow.getScreeningNotes())
                .orientationCompletedAt(workflow.getOrientationCompletedAt())
                .orientationCompletedByName(workflow.getOrientationCompletedBy() != null ? 
                        workflow.getOrientationCompletedBy().getFirstName() + " " + workflow.getOrientationCompletedBy().getLastName() : null)
                .orientationNotes(workflow.getOrientationNotes())
                .enrolledAt(workflow.getEnrolledAt())
                .enrolledByName(workflow.getEnrolledBy() != null ? 
                        workflow.getEnrolledBy().getFirstName() + " " + workflow.getEnrolledBy().getLastName() : null)
                .trainingBatchId(batch != null ? batch.getId() : null)
                .trainingBatchCode(batch != null ? batch.getBatchCode() : null)
                .trainingName(batch != null && batch.getTraining() != null ? batch.getTraining().getName() : null)
                .enrollmentNotes(workflow.getEnrollmentNotes())
                .createdAt(workflow.getCreatedAt())
                .updatedAt(workflow.getUpdatedAt())
                .build();
    }
}
