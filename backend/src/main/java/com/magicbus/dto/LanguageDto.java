package com.magicbus.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LanguageDto {
    private Long candidateId;
    private String languageName;
    private String proficiencyLevel;  // BASIC, INTERMEDIATE, FLUENT, NATIVE
}
