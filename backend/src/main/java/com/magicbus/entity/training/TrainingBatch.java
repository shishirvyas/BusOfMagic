package com.magicbus.entity.training;

import com.magicbus.entity.workflow.CandidateWorkflow;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "training_batches")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainingBatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "training_id", nullable = false)
    private TrainingMaster training;

    @Column(name = "batch_code", nullable = false, unique = true, length = 50)
    private String batchCode;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "max_capacity")
    @Builder.Default
    private Integer maxCapacity = 30;

    @Column(name = "current_enrolled")
    @Builder.Default
    private Integer currentEnrolled = 0;

    @Column(name = "location", length = 200)
    private String location;

    @Column(name = "trainer_name", length = 100)
    private String trainerName;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @OneToMany(mappedBy = "trainingBatch")
    @Builder.Default
    private List<CandidateWorkflow> enrolledCandidates = new ArrayList<>();

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

    // Helper method to check if batch has capacity
    public boolean hasCapacity() {
        return currentEnrolled < maxCapacity;
    }

    // Helper method to get available slots
    public int getAvailableSlots() {
        return maxCapacity - currentEnrolled;
    }
}
