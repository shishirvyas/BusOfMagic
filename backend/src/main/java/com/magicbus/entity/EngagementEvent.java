package com.magicbus.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "engagement_event", indexes = {
    @Index(name = "idx_engagement_event_type", columnList = "event_type"),
    @Index(name = "idx_engagement_event_date", columnList = "event_date"),
    @Index(name = "idx_engagement_event_candidate_date", columnList = "candidate_id, event_date"),
    @Index(name = "idx_engagement_event_weight", columnList = "engagement_weight_points")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EngagementEvent {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;
    
    // Event Information
    @Column(length = 100, nullable = false)
    private String eventType;  // COURSE_STARTED, COURSE_COMPLETED, QUIZ_ATTEMPTED, ASSIGNMENT_SUBMITTED, etc.
    
    @Column(length = 50)
    private String eventCategory;  // LEARNING, ASSESSMENT, INTERACTION, CERTIFICATION, BEHAVIORAL
    
    @Column(columnDefinition = "TEXT")
    private String eventDescription;
    
    // Event Details
    @Column(length = 255)
    private String referenceId;  // Course ID, Quiz ID, etc.
    
    @Column(length = 100)
    private String referenceType;  // COURSE, QUIZ, ASSIGNMENT, SESSION, etc.
    
    // AI-Related Fields
    @Column(name = "engagement_weight_points", precision = 5, scale = 2)
    private BigDecimal engagementWeightPoints;  // Points for engagement calculation
    
    @Column(name = "sentiment_score", precision = 5, scale = 2)
    private BigDecimal sentimentScore;  // AI sentiment: -100 to 100
    
    @Column(name = "event_importance", length = 50)
    private String eventImportance;  // LOW, MEDIUM, HIGH
    
    // Metadata
    @Column(name = "duration_minutes")
    private Integer durationMinutes;
    
    @Column(name = "score_obtained", precision = 5, scale = 2)
    private BigDecimal scoreObtained;
    
    @Column(length = 50)
    private String status;  // INITIATED, COMPLETED, FAILED, IN_PROGRESS
    
    // Timestamps
    @Column(name = "event_date", nullable = false)
    private LocalDateTime eventDate = LocalDateTime.now();
    
    @Column(name = "event_time")
    private String eventTime;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
