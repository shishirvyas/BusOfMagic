package com.magicbus.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OnboardingQuestionDto {
    private Long id;
    private String questionText;
    private String questionType;
    private String questionCategory;
    private String description;
    private List<String> options;
    private Boolean isMandatory;
    private Integer displayOrder;
    private String helpText;
    private String placeholderText;
}
