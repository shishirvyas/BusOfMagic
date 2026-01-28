package com.magicbus.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for saving skills and languages in signup step 5
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillsAndLanguagesDto {
    
    private Long candidateId;
    private List<SkillDto> skills;
    private List<LanguageDto> languages;
}
