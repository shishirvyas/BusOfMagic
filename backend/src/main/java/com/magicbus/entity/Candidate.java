package com.magicbus.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "candidate", indexes = {
    @Index(name = "idx_candidate_phone", columnList = "phone_number"),
    @Index(name = "idx_candidate_status", columnList = "status"),
    @Index(name = "idx_candidate_dropout_risk", columnList = "dropout_risk_score"),
    @Index(name = "idx_candidate_engagement", columnList = "engagement_score"),
    @Index(name = "idx_candidate_created_at", columnList = "created_at"),
    @Index(name = "idx_candidate_city_state", columnList = "city, state"),
    @Index(name = "idx_candidate_age", columnList = "date_of_birth")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Candidate {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Basic Information
    @Column(length = 100, nullable = false)
    private String firstName;
    
    @Column(length = 100)
    private String middleName;
    
    @Column(length = 100, nullable = false)
    private String lastName;
    
    @Column(length = 255, unique = true)
    private String email;
    
    @Column(length = 20, nullable = false, unique = true)
    private String phoneNumber;
    
    @Column(length = 20)
    private String alternatePhone;
    
    @Column(nullable = false)
    private LocalDate dateOfBirth;
    
    // Address Information
    @Column(length = 255, nullable = false)
    private String addressLine1;
    
    @Column(length = 255)
    private String addressLine2;
    
    @Column(length = 100, nullable = false)
    private String city;
    
    @Column(length = 100, nullable = false)
    private String state;
    
    @Column(length = 10, nullable = false)
    private String pincode;
    
    @Column(length = 100)
    private String country = "India";
    
    // Demographics
    @Column(length = 20, nullable = false)
    private String gender;  // MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY
    
    @Column(length = 100)
    private String motherTongue;
    
    @Column(length = 100)
    private String religion;
    
    @Column(length = 100)
    private String caste;
    
    @Column(length = 20)
    private String maritalStatus;  // SINGLE, MARRIED, DIVORCED, WIDOWED
    
    // Family Information
    @Column(length = 255)
    private String guardianName;
    
    @Column(length = 20)
    private String guardianPhone;
    
    @Column(length = 255)
    private String guardianEmail;
    
    @Column(length = 255)
    private String fatherName;
    
    @Column(length = 255)
    private String motherName;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal familyMonthlyIncome;
    
    private Integer numberOfSiblings;
    
    // Mobilisation
    @ManyToOne
    @JoinColumn(name = "mobilisation_source_id")
    private MobilisationSource mobilisationSource;
    
    @Column(length = 255)
    private String mobilisedBy;
    
    private LocalDate mobilisationDate;
    
    // Profile Status
    @Column(length = 50, nullable = false)
    private String status = "REGISTERED";  // REGISTERED, ACTIVE, INACTIVE, GRADUATED, DROPOUT, PLACED
    
    @Column(name = "profile_completion_percentage")
    private Integer profileCompletionPercentage = 0;
    
    // AI-Related Fields
    @Column(precision = 5, scale = 2)
    private BigDecimal engagementScore = BigDecimal.valueOf(50.00);  // 0-100
    
    @Column(precision = 5, scale = 2)
    private BigDecimal dropoutRiskScore = BigDecimal.ZERO;  // 0-100
    
    @Column(length = 50)
    private String riskCategory = "LOW";  // LOW, MEDIUM, HIGH
    
    @Column(length = 50)
    private String recommendationStatus;  // ONBOARD, MONITOR, INTERVENTION_NEEDED
    
    @Column(name = "ai_prediction_date")
    private LocalDateTime aiPredictionDate;
    
    @Column(name = "ai_prediction_model_version", length = 50)
    private String aiPredictionModelVersion;
    
    // Activity Tracking
    @Column(name = "last_login")
    private LocalDateTime lastLogin;
    
    @Column(name = "login_count")
    private Integer loginCount = 0;
    
    // Timestamps
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    @Column(name = "created_by")
    private String createdBy;
    
    @Column(name = "updated_by")
    private String updatedBy;
    
    // Relationships
    @OneToOne(mappedBy = "candidate", cascade = CascadeType.ALL)
    private EducationDetails educationDetails;
    
    @OneToOne(mappedBy = "candidate", cascade = CascadeType.ALL)
    private PersonalDetails personalDetails;
}
