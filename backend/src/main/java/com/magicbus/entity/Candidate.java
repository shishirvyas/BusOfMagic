package com.magicbus.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "candidate")
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
    @Builder.Default
    private String country = "India";
    
    // Demographics
    @Column(length = 20, nullable = false)
    private String gender;
    
    @Column(length = 100)
    private String motherTongue;
    
    @Column(length = 100)
    private String religion;
    
    @Column(length = 100)
    private String caste;
    
    @Column(length = 20)
    private String maritalStatus;
    
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
    
    // Identification Documents
    @Column(length = 20)
    private String aadharNumber;
    
    @Column(length = 20)
    private String panNumber;
    
    // Status & Tracking
    @Column(length = 50)
    @Builder.Default
    private String status = "ACTIVE";
    
    @Column(length = 50)
    @Builder.Default
    private String onboardingStatus = "INCOMPLETE";
    
    // Scoring & Engagement
    @Column(precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal dropoutRiskScore = BigDecimal.ZERO;
    
    @Column(precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal engagementScore = BigDecimal.ZERO;
    
    // Timestamps
    @Column(updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    // Relationships
    @OneToOne(mappedBy = "candidate", cascade = CascadeType.ALL)
    private EducationDetails educationDetails;
    
    @OneToOne(mappedBy = "candidate", cascade = CascadeType.ALL)
    private PersonalDetails personalDetails;
}
