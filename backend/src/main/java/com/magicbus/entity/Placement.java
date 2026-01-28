package com.magicbus.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "placement", indexes = {
    @Index(name = "idx_placement_status", columnList = "placement_status"),
    @Index(name = "idx_placement_candidate", columnList = "candidate_id"),
    @Index(name = "idx_placement_candidate_status", columnList = "candidate_id, placement_status"),
    @Index(name = "idx_placement_joining_date", columnList = "joining_date"),
    @Index(name = "idx_placement_employer", columnList = "employer_id"),
    @Index(name = "idx_placement_active", columnList = "is_currently_active")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Placement {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;
    
    @ManyToOne
    @JoinColumn(name = "job_opening_id", nullable = false)
    private JobOpening jobOpening;
    
    @ManyToOne
    @JoinColumn(name = "employer_id", nullable = false)
    private Employer employer;
    
    // Placement Details
    @Column(length = 50, nullable = false)
    private String placementStatus = "PENDING";  // PENDING, SELECTED, OFFERED, JOINED, COMPLETED, REJECTED, FAILED
    
    // Salary & Compensation
    @Column(name = "offered_ctc", precision = 10, scale = 2)
    private BigDecimal offeredCTC;
    
    @Column(name = "offered_base_salary", precision = 10, scale = 2)
    private BigDecimal offeredBaseSalary;
    
    @Column(name = "offered_variable_pay", precision = 10, scale = 2)
    private BigDecimal offeredVariablePay;
    
    // Important Dates
    @Column(name = "offered_date")
    private LocalDateTime offeredDate;
    
    @Column(name = "joining_date")
    private LocalDate joiningDate;
    
    @Column(name = "probation_end_date")
    private LocalDate probationEndDate;
    
    @Column(name = "contract_end_date")
    private LocalDate contractEndDate;
    
    // AI Predictions
    @Column(name = "placement_match_score", precision = 5, scale = 2)
    private BigDecimal placementMatchScore;  // 0-100
    
    @Column(name = "expected_success_probability", precision = 5, scale = 2)
    private BigDecimal expectedSuccessProbability;  // 0-100
    
    @Column(name = "expected_retention_months")
    private Integer expectedRetentionMonths;
    
    @Column(name = "expected_retention_score", precision = 5, scale = 2)
    private BigDecimal expectedRetentionScore;  // 0-100
    
    // Post-Placement Tracking
    @Column(name = "is_currently_active")
    private Boolean isCurrentlyActive = true;
    
    @Column(name = "resignation_date")
    private LocalDateTime resignationDate;
    
    @Column(name = "resignation_reason", length = 255)
    private String resignationReason;
    
    @Column(name = "total_months_employed", precision = 3, scale = 1)
    private BigDecimal totalMonthsEmployed;
    
    @Column(name = "performance_feedback", columnDefinition = "TEXT")
    private String performanceFeedback;
    
    // Satisfaction
    @Column(name = "candidate_satisfaction_score", precision = 3, scale = 1)
    private BigDecimal candidateSatisfactionScore;  // Out of 5
    
    @Column(name = "employer_satisfaction_score", precision = 3, scale = 1)
    private BigDecimal employerSatisfactionScore;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
}
