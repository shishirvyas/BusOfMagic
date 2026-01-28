package com.magicbus.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignupRequestDTO {
    private String fullName;
    private String dateOfBirth;
    private String email;
    private String mobile;
    private String contactType;
}
