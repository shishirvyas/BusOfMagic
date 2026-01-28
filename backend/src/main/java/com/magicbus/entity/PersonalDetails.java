package com.magicbus.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "personal_details")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PersonalDetails {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;
    
    // Background
    @Column(length = 50)
    private String employmentStatus;
    
    @Column(length = 255)
    private String currentJobTitle;
    
    @Column(length = 255)
    private String currentCompanyName;
    
    @Column(precision = 3, scale = 1)
    private BigDecimal yearsOfExperience;
    
    @Column(columnDefinition = "TEXT")
    private String previousEmployers;
    
    // Financial Information
    @Column(length = 50)
    private String bankAccountNumber;
    
    @Column(length = 20)
    private String ifscCode;
    
    @Column(length = 255)
    private String bankName;
    
    @Column(length = 255)
    private String accountHolderName;
    
    private Boolean aadharVerified = false;
    
    // Interests & Preferences
    @Column(columnDefinition = "TEXT")
    private String careerInterests;
    
    @Column(columnDefinition = "TEXT")
    private String preferredJobRoles;
    
    @Column(columnDefinition = "TEXT")
    private String preferredLocations;
    
    @Column(length = 100)
    private String preferredJobTypes;
    
    // Personal Circumstances
    private Boolean hasDisability = false;
    
    @Column(length = 255)
    private String disabilityType;
    
    private Boolean isFirstGenerationLearner = false;
    
    @Column(length = 50)
    private String migrationStatus;
    
    // Availability
    private LocalDate earliestJoinDate;
    
    private Boolean availabilityToRelocate = false;
    
    private Boolean availabilityForInternship = true;
    
    @Column(updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
