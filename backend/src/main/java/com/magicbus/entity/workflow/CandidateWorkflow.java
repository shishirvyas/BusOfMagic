package com.magicbus.entity.workflow;

import com.magicbus.entity.Candidate;
import com.magicbus.entity.auth.AdminUser;
import com.magicbus.entity.training.TrainingBatch;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "candidate_workflow")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateWorkflow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id", nullable = false, unique = true)
    private Candidate candidate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private WorkflowStatus status = WorkflowStatus.PENDING_SCREENING;

    // Screening fields
    @Column(name = "screening_completed_at")
    private LocalDateTime screeningCompletedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "screening_completed_by")
    private AdminUser screeningCompletedBy;

    @Column(name = "screening_notes", columnDefinition = "TEXT")
    private String screeningNotes;

    // Orientation fields
    @Column(name = "orientation_completed_at")
    private LocalDateTime orientationCompletedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "orientation_completed_by")
    private AdminUser orientationCompletedBy;

    @Column(name = "orientation_notes", columnDefinition = "TEXT")
    private String orientationNotes;

    // Enrollment fields
    @Column(name = "enrolled_at")
    private LocalDateTime enrolledAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enrolled_by")
    private AdminUser enrolledBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "training_batch_id")
    private TrainingBatch trainingBatch;

    @Column(name = "enrollment_notes", columnDefinition = "TEXT")
    private String enrollmentNotes;

    // Timestamps
    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
