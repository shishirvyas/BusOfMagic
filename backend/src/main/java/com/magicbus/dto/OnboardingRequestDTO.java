package com.magicbus.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OnboardingRequestDTO {
    // Personal Details
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String dateOfBirth;
    private String gender;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String aadhar;
    private String pan;
    private String bankAccount;

    // Education Details
    private String education10th;
    private String score10th;
    private String education12th;
    private String score12th;
    private String graduationDegree;
    private String graduationField;
    private String graduationScore;

    // Skills
    private List<String> skills;
    private List<String> languagesKnown;
    private List<String> certifications;
}
