package com.magicbus.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "candidate_onboarding_progress")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateOnboardingProgress {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;
    
    @ManyToOne
    @JoinColumn(name = "onboarding_step_id", nullable = false)
    private OnboardingStep onboardingStep;
    
    // Progress Status
    @Column(length = 50, nullable = false)
    @Builder.Default
    private String status = "PENDING";  // PENDING, IN_PROGRESS, COMPLETED, SKIPPED
    
    @Column(name = "completion_percentage")
    @Builder.Default
    private Integer completionPercentage = 0;
    
    // Timestamps
    @Column(name = "started_date")
    private LocalDateTime startedDate;
    
    @Column(name = "completed_date")
    private LocalDateTime completedDate;
    
    @Column(name = "expected_completion_date")
    private LocalDateTime expectedCompletionDate;
    
    // Metadata
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "assigned_to", length = 255)
    private String assignedTo;
    
    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
