package com.magicbus.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileDetailsDto {
    private Long candidateId;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
}
