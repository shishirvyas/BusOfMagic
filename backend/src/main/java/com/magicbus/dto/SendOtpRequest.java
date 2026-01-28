package com.magicbus.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SendOtpRequest {
    private String contact;  // Email or phone number
    private String contactType;  // EMAIL or PHONE
}

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
class SendOtpResponse {
    private Boolean success;
    private String message;
    private String transactionId;
}
