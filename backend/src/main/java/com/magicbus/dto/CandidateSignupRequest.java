package com.magicbus.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateSignupRequest {
    private String firstName;
    private String middleName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String alternatePhone;
    private LocalDate dateOfBirth;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String pincode;
    private String country;
    private String gender;
    private String motherTongue;
    private String religion;
    private String caste;
    private String maritalStatus;
    private String guardianName;
    private String guardianPhone;
    private String guardianEmail;
    private String fatherName;
    private String motherName;
    private String aadharNumber;
    private String panNumber;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
class CandidateSignupResponse {
    private Long candidateId;
    private String message;
    private String status;
    private String nextStep;
}
