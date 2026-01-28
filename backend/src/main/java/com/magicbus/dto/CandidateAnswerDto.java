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
public class CandidateAnswerDto {
    private Long questionId;
    private String answerText;
    private List<String> answerArray;
    private Integer ratingScore;
}
