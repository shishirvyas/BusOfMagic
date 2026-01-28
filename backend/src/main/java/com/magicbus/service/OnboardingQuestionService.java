package com.magicbus.service;

import com.magicbus.dto.CandidateAnswerDto;
import com.magicbus.dto.OnboardingQuestionDto;
import com.magicbus.dto.SubmitAnswersRequest;
import com.magicbus.entity.Candidate;
import com.magicbus.entity.CandidateAnswer;
import com.magicbus.entity.OnboardingProgress;
import com.magicbus.entity.OnboardingQuestion;
import com.magicbus.repository.CandidateAnswerRepository;
import com.magicbus.repository.CandidateRepository;
import com.magicbus.repository.OnboardingProgressRepository;
import com.magicbus.repository.OnboardingQuestionRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OnboardingQuestionService {

    private final OnboardingQuestionRepository questionRepository;
    private final CandidateAnswerRepository answerRepository;
    private final CandidateRepository candidateRepository;
    private final OnboardingProgressRepository progressRepository;
    private final ObjectMapper objectMapper;

    /**
     * Get all active onboarding questions
     */
    public List<OnboardingQuestionDto> getAllActiveQuestions() {
        log.info("Fetching all active onboarding questions");
        List<OnboardingQuestion> questions = questionRepository.findByIsActiveTrueOrderByDisplayOrderAsc();
        return questions.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get questions by category
     */
    public List<OnboardingQuestionDto> getQuestionsByCategory(String category) {
        log.info("Fetching questions for category: {}", category);
        List<OnboardingQuestion> questions = questionRepository.findByQuestionCategoryAndIsActiveTrueOrderByDisplayOrderAsc(category);
        return questions.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get all question categories
     */
    public List<String> getAllCategories() {
        return questionRepository.findAllActiveCategories();
    }

    /**
     * Get candidate's existing answers
     */
    public List<CandidateAnswerDto> getCandidateAnswers(Long candidateId) {
        log.info("Fetching answers for candidate: {}", candidateId);
        List<CandidateAnswer> answers = answerRepository.findByCandidateId(candidateId);
        return answers.stream()
                .map(this::convertAnswerToDto)
                .collect(Collectors.toList());
    }

    /**
     * Submit candidate answers
     */
    @Transactional
    public void submitAnswers(SubmitAnswersRequest request) {
        log.info("Submitting answers for candidate: {}", request.getCandidateId());
        
        Candidate candidate = candidateRepository.findById(request.getCandidateId())
                .orElseThrow(() -> new RuntimeException("Candidate not found: " + request.getCandidateId()));

        for (CandidateAnswerDto answerDto : request.getAnswers()) {
            OnboardingQuestion question = questionRepository.findById(answerDto.getQuestionId())
                    .orElseThrow(() -> new RuntimeException("Question not found: " + answerDto.getQuestionId()));

            // Check if answer already exists
            CandidateAnswer existingAnswer = answerRepository
                    .findByCandidateIdAndQuestionId(request.getCandidateId(), answerDto.getQuestionId())
                    .orElse(null);

            CandidateAnswer answer;
            if (existingAnswer != null) {
                answer = existingAnswer;
                answer.setUpdatedAt(LocalDateTime.now());
            } else {
                answer = CandidateAnswer.builder()
                        .candidate(candidate)
                        .question(question)
                        .answeredAt(LocalDateTime.now())
                        .build();
            }

            // Set answer based on question type
            answer.setAnswerText(answerDto.getAnswerText());
            answer.setRatingScore(answerDto.getRatingScore());
            
            // Convert array to JSON string
            if (answerDto.getAnswerArray() != null && !answerDto.getAnswerArray().isEmpty()) {
                try {
                    answer.setAnswerArray(objectMapper.writeValueAsString(answerDto.getAnswerArray()));
                } catch (JsonProcessingException e) {
                    log.error("Error converting answer array to JSON", e);
                }
            }
            
            answer.setIsSubmitted(true);
            answer.setIsPartiallyAnswered(false);
            
            answerRepository.save(answer);
        }

        // Update onboarding progress
        updateQuestionsProgress(candidate);
        
        log.info("Answers submitted successfully for candidate: {}", request.getCandidateId());
    }

    /**
     * Update onboarding progress after questions submission
     */
    private void updateQuestionsProgress(Candidate candidate) {
        OnboardingProgress progress = progressRepository.findByCandidateId(candidate.getId())
                .orElse(null);
        
        if (progress != null) {
            progress.setQuestionsCompleted(true);
            progress.setQuestionsCompletedAt(LocalDateTime.now());
            progress.setCurrentStep("COMPLETED");
            progress.setOverallCompleted(true);
            progress.setOverallCompletedAt(LocalDateTime.now());
            progress.setProgressPercentage(new BigDecimal(100));
            progress.setUpdatedAt(LocalDateTime.now());
            progressRepository.save(progress);
        }
        
        // Update candidate status
        candidate.setOnboardingStatus("COMPLETED");
        candidate.setUpdatedAt(LocalDateTime.now());
        candidateRepository.save(candidate);
    }

    /**
     * Convert entity to DTO
     */
    private OnboardingQuestionDto convertToDto(OnboardingQuestion question) {
        List<String> optionsList = new ArrayList<>();
        
        // Parse JSON options string to list
        if (question.getOptions() != null && !question.getOptions().isEmpty()) {
            try {
                optionsList = objectMapper.readValue(question.getOptions(), new TypeReference<List<String>>() {});
            } catch (JsonProcessingException e) {
                log.error("Error parsing options JSON: {}", e.getMessage());
            }
        }
        
        return OnboardingQuestionDto.builder()
                .id(question.getId())
                .questionText(question.getQuestionText())
                .questionType(question.getQuestionType())
                .questionCategory(question.getQuestionCategory())
                .description(question.getDescription())
                .options(optionsList)
                .isMandatory(question.getIsMandatory())
                .displayOrder(question.getDisplayOrder())
                .helpText(question.getHelpText())
                .placeholderText(question.getPlaceholderText())
                .build();
    }

    /**
     * Convert answer entity to DTO
     */
    private CandidateAnswerDto convertAnswerToDto(CandidateAnswer answer) {
        List<String> answerArray = new ArrayList<>();
        
        if (answer.getAnswerArray() != null && !answer.getAnswerArray().isEmpty()) {
            try {
                answerArray = objectMapper.readValue(answer.getAnswerArray(), new TypeReference<List<String>>() {});
            } catch (JsonProcessingException e) {
                log.error("Error parsing answer array JSON: {}", e.getMessage());
            }
        }
        
        return CandidateAnswerDto.builder()
                .questionId(answer.getQuestion().getId())
                .answerText(answer.getAnswerText())
                .answerArray(answerArray)
                .ratingScore(answer.getRatingScore())
                .build();
    }
}
