package com.magicbus.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "employer", indexes = {
    @Index(name = "idx_employer_status", columnList = "partnership_status")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Company Information
    @Column(length = 255, nullable = false, unique = true)
    private String companyName;
    
    @Column(name = "company_registration_number", length = 100)
    private String companyRegistrationNumber;
    
    // Contact Information
    @Column(name = "contact_person_name", length = 255, nullable = false)
    private String contactPersonName;
    
    @Column(name = "contact_email", length = 255, nullable = false)
    private String contactEmail;
    
    @Column(name = "contact_phone", length = 20, nullable = false)
    private String contactPhone;
    
    @Column(name = "hr_email", length = 255)
    private String hrEmail;
    
    @Column(name = "hr_phone", length = 20)
    private String hrPhone;
    
    // Company Details
    @Column(length = 100)
    private String industry;
    
    @Column(name = "company_size", length = 50)
    private String companySize;  // STARTUP, SMALL, MEDIUM, LARGE, ENTERPRISE
    
    @Column(name = "established_year")
    private Integer establishedYear;
    
    @Column(name = "headquarters_location", length = 255)
    private String headquartersLocation;
    
    @Column(name = "website_url", length = 500)
    private String websiteUrl;
    
    // Hiring Information
    @Column(name = "number_of_openings")
    private Integer numberOfOpenings = 0;
    
    @Column(name = "recruitment_frequency", length = 50)
    private String recruitmentFrequency;  // ONGOING, QUARTERLY, ANNUAL, AD_HOC
    
    @Column(name = "preferred_skill_sets", columnDefinition = "TEXT")
    private String preferredSkillSets;  // JSON array
    
    @Column(name = "preferred_educational_background", columnDefinition = "TEXT")
    private String preferredEducationalBackground;  // JSON array
    
    // Partnership Status
    @Column(name = "partnership_status", length = 50)
    private String partnershipStatus = "ACTIVE";  // ACTIVE, INACTIVE, SUSPENDED
    
    @Column(name = "agreement_date")
    private LocalDate agreementDate;
    
    // Financial
    @Column(name = "average_ctc_offered", precision = 10, scale = 2)
    private BigDecimal averageCTCOffered;
    
    // Metadata
    @Column(precision = 3, scale = 1)
    private BigDecimal rating;  // Out of 5
    
    @Column(name = "total_placements_count")
    private Integer totalPlacementsCount = 0;
    
    @Column(name = "success_rate", precision = 5, scale = 2)
    private BigDecimal successRate;  // % of candidates who stayed > 6 months
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    @Column(name = "created_by", length = 255)
    private String createdBy;
}
