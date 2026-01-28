package com.magicbus.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PersonalDetailsDto {
    private Long candidateId;
    private String employmentStatus;
    private String currentJobTitle;
    private String currentCompanyName;
    private Double yearsOfExperience;
    private String previousEmployers;  // JSON array
    private String bankAccountNumber;
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
