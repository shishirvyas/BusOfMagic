package com.magicbus.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerifyOtpRequest {
    private String contact;  // Email or phone number
    private String otpCode;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
class VerifyOtpResponse {
    private Boolean success;
    private String message;
    private String token;
    private Long candidateId;
}
