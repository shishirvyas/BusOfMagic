package com.magicbus.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "dropout_risk", indexes = {
    @Index(name = "idx_dropout_risk_score", columnList = "risk_score"),
    @Index(name = "idx_dropout_risk_category", columnList = "risk_category"),
    @Index(name = "idx_dropout_risk_status", columnList = "intervention_status"),
    @Index(name = "idx_dropout_risk_prediction_date", columnList = "prediction_date"),
    @Index(name = "idx_dropout_risk_assigned_mentor", columnList = "assigned_mentor_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DropoutRisk {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;
    
    // Risk Assessment
    @Column(precision = 5, scale = 2, nullable = false)
    private BigDecimal riskScore;  // 0-100: Higher = Higher risk
    
    @Column(length = 50, nullable = false)
    private String riskCategory;  // LOW, MEDIUM, HIGH, CRITICAL
    
    // Risk Factors (AI Analyzed)
    @Column(columnDefinition = "TEXT", nullable = false)
    private String riskFactors;  // JSON array
    
    // AI-Identified Risk Drivers
    @Column(name = "engagement_decline_detected")
    private Boolean engagementDeclineDetected = false;
    
    @Column(name = "attendance_decline_detected")
    private Boolean attendanceDeclineDetected = false;
    
    @Column(name = "assessment_performance_decline")
    private Boolean assessmentPerformanceDecline = false;
    
    @Column(name = "social_engagement_decline")
    private Boolean socialEngagementDecline = false;
    
    @Column(name = "motivation_score", precision = 5, scale = 2)
    private BigDecimal motivationScore;
    
    // Risk Indicators
    @Column(name = "days_since_last_activity")
    private Integer daysSinceLastActivity;
    
    @Column(name = "missed_sessions_count")
    private Integer missedSessionsCount = 0;
    
    @Column(name = "failed_assessments_count")
    private Integer failedAssessmentsCount = 0;
    
    @Column(name = "incomplete_tasks_count")
    private Integer incompleteTasksCount = 0;
    
    // Mitigation Strategies (AI Recommended)
    @Column(name = "suggested_interventions", columnDefinition = "TEXT")
    private String suggestedInterventions;  // JSON array
    
    @Column(name = "intervention_priority", length = 50)
    private String interventionPriority;  // IMMEDIATE, URGENT, HIGH, MEDIUM, LOW
    
    // Intervention Actions
    @Column(name = "intervention_status", length = 50)
    private String interventionStatus = "NOT_STARTED";  // NOT_STARTED, IN_PROGRESS, COMPLETED, MONITORING
    
    @ManyToOne
    @JoinColumn(name = "assigned_mentor_id")
    private Mentor assignedMentor;
    
    // Outcome Tracking
    @Column(name = "risk_mitigated")
    private Boolean riskMitigated = false;
    
    @Column(columnDefinition = "TEXT")
    private String outcome;
    
    // AI Model Information
    @Column(name = "prediction_date", nullable = false)
    private LocalDateTime predictionDate = LocalDateTime.now();
    
    @Column(name = "model_version", length = 50)
    private String modelVersion;
    
    @Column(name = "confidence_score", precision = 5, scale = 2)
    private BigDecimal confidenceScore;  // Model confidence 0-100
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    @Column(name = "assessed_by", length = 255)
    private String assessedBy;
}
