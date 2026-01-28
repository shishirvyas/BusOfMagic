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
    @Column(name = "employment_status", length = 50)
    private String employmentStatus;  // EMPLOYED, SELF_EMPLOYED, UNEMPLOYED, STUDENT
    
    @Column(name = "current_job_title", length = 255)
    private String currentJobTitle;
    
    @Column(name = "current_company_name", length = 255)
    private String currentCompanyName;
    
    @Column(name = "years_of_experience", precision = 3, scale = 1)
    private BigDecimal yearsOfExperience;
    
    @Column(columnDefinition = "TEXT")
    private String previousEmployers;  // JSON array
    
    // Financial Information
    @Column(name = "bank_account_number", length = 50)
    private String bankAccountNumber;
    
    @Column(name = "ifsc_code", length = 20)
    private String ifscCode;
    
    @Column(name = "bank_name", length = 255)
    private String bankName;
    
    @Column(name = "account_holder_name", length = 255)
    private String accountHolderName;
    
    @Column(name = "aadhar_number", length = 20)
    private String aadharNumber;
    
    @Column(name = "aadhar_verified")
    private Boolean aadharVerified = false;
    
    @Column(name = "pan_number", length = 20)
    private String panNumber;
    
    // Interests & Preferences
    @Column(columnDefinition = "TEXT")
    private String careerInterests;  // JSON array
    
    @Column(columnDefinition = "TEXT")
    private String preferredJobRoles;  // JSON array
    
    @Column(columnDefinition = "TEXT")
    private String preferredLocations;  // JSON array
    
    @Column(name = "preferred_job_types", length = 100)
    private String preferredJobTypes;  // FULL_TIME, PART_TIME, INTERNSHIP, FREELANCE
    
    // Personal Circumstances
    @Column(name = "has_disability")
    private Boolean hasDisability = false;
    
    @Column(name = "disability_type", length = 255)
    private String disabilityType;
    
    @Column(name = "is_first_generation_learner")
    private Boolean isFirstGenerationLearner = false;
    
    @Column(name = "migration_status", length = 50)
    private String migrationStatus;  // RESIDENT, MIGRANT
    
    // Availability
    @Column(name = "earliest_join_date")
    private LocalDate earliestJoinDate;
    
    @Column(name = "availability_to_relocate")
    private Boolean availabilityToRelocate = false;
    
    @Column(name = "availability_for_internship")
    private Boolean availabilityForInternship = true;
    
    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
