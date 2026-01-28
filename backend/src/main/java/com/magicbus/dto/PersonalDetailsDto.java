package com.magicbus.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PersonalDetailsDto {
    private Long candidateId;
    
    // ========== Basic Candidate Information ==========
    // These fields will be saved to the Candidate entity
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private LocalDate dateOfBirth;
    private String gender;
    private String address;  // Maps to addressLine1
    private String city;
    private String state;
    private String pincode;
    private String aadhar;   // Maps to aadharNumber
    private String pan;      // Maps to panNumber
    private String bankAccount;  // Maps to bankAccountNumber in PersonalDetails
    
    // ========== Employment & Career (PersonalDetails entity) ==========
    private String employmentStatus;
    private String currentJobTitle;
    private String currentCompanyName;
    private Double yearsOfExperience;
    private String previousEmployers;  // JSON array
    private String ifscCode;
    private String bankName;
    private String accountHolderName;
    private Boolean aadharVerified;
    private String careerInterests;  // JSON array
    private String preferredJobRoles;  // JSON array
    private String preferredLocations;  // JSON array
    private String preferredJobTypes;
    private Boolean hasDisability;
    private String disabilityType;
    private Boolean isFirstGenerationLearner;
    private String migrationStatus;
    private LocalDate earliestJoinDate;
    private Boolean availabilityToRelocate;
    private Boolean availabilityForInternship;
}
