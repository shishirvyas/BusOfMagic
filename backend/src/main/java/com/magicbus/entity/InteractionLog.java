package com.magicbus.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "interaction_log", indexes = {
    @Index(name = "idx_interaction_log_date", columnList = "interaction_date"),
    @Index(name = "idx_interaction_log_type", columnList = "interaction_type")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InteractionLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;
    
    @Column(length = 50, nullable = false)
    private String interactionType;  // CALL, MESSAGE, MEETING, EMAIL, FOLLOW_UP
    
    @Column(length = 50)
    private String interactionChannel;  // PHONE, WHATSAPP, EMAIL, IN_PERSON, VIDEO_CALL
    
    @Column(name = "interaction_date", nullable = false)
    private LocalDateTime interactionDate = LocalDateTime.now();
    
    @Column(name = "duration_minutes")
    private Integer durationMinutes;
    
    @Column(columnDefinition = "TEXT")
    private String purpose;
    
    @Column(columnDefinition = "TEXT")
    private String summary;
    
    @Column(length = 255)
    private String outcome;  // POSITIVE, NEUTRAL, NEGATIVE, ACTION_REQUIRED
    
    @Column(name = "follow_up_required")
    private Boolean followUpRequired = false;
    
    @Column(name = "follow_up_date")
    private LocalDateTime followUpDate;
    
    @Column(name = "conducted_by", length = 255)
    private String conductedBy;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
