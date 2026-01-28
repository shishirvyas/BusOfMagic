package com.magicbus.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OnboardingResponseDTO {
    private Long candidateId;
    private String firstName;
    private String lastName;
    private String email;
    private String message;
    private boolean success;
}
