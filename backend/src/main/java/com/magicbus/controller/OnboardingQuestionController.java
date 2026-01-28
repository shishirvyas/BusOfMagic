package com.magicbus.controller;

import com.magicbus.dto.CandidateAnswerDto;
import com.magicbus.dto.OnboardingQuestionDto;
import com.magicbus.dto.SubmitAnswersRequest;
import com.magicbus.service.OnboardingQuestionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/onboarding")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class OnboardingQuestionController {

    private final OnboardingQuestionService questionService;

    /**
     * GET /api/onboarding/questions
     * Get all active onboarding questions
     */
    @GetMapping("/questions")
    public ResponseEntity<?> getAllQuestions() {
        try {
            log.info("Fetching all onboarding questions");
            List<OnboardingQuestionDto> questions = questionService.getAllActiveQuestions();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("questions", questions);
            response.put("totalQuestions", questions.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching questions", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to fetch questions: " + e.getMessage()));
        }
    }

    /**
     * GET /api/onboarding/questions/categories
     * Get all question categories
     */
    @GetMapping("/questions/categories")
    public ResponseEntity<?> getAllCategories() {
        try {
            List<String> categories = questionService.getAllCategories();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("categories", categories);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching categories", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to fetch categories: " + e.getMessage()));
        }
    }

    /**
     * GET /api/onboarding/questions/category/{category}
     * Get questions by category
     */
    @GetMapping("/questions/category/{category}")
    public ResponseEntity<?> getQuestionsByCategory(@PathVariable String category) {
        try {
            log.info("Fetching questions for category: {}", category);
            List<OnboardingQuestionDto> questions = questionService.getQuestionsByCategory(category);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("category", category);
            response.put("questions", questions);
            response.put("totalQuestions", questions.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching questions by category", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to fetch questions: " + e.getMessage()));
        }
    }

    /**
     * GET /api/onboarding/answers/{candidateId}
     * Get candidate's existing answers
     */
    @GetMapping("/answers/{candidateId}")
    public ResponseEntity<?> getCandidateAnswers(@PathVariable Long candidateId) {
        try {
            log.info("Fetching answers for candidate: {}", candidateId);
            List<CandidateAnswerDto> answers = questionService.getCandidateAnswers(candidateId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("candidateId", candidateId);
            response.put("answers", answers);
            response.put("totalAnswers", answers.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching answers", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to fetch answers: " + e.getMessage()));
        }
    }

    /**
     * POST /api/onboarding/answers
     * Submit candidate answers
     */
    @PostMapping("/answers")
    public ResponseEntity<?> submitAnswers(@RequestBody SubmitAnswersRequest request) {
        try {
            log.info("Submitting answers for candidate: {}", request.getCandidateId());
            
            // Validate request
            if (request.getCandidateId() == null) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Candidate ID is required"));
            }
            
            if (request.getAnswers() == null || request.getAnswers().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("At least one answer is required"));
            }
            
            questionService.submitAnswers(request);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Answers submitted successfully");
            response.put("candidateId", request.getCandidateId());
            response.put("answersSubmitted", request.getAnswers().size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error submitting answers", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to submit answers: " + e.getMessage()));
        }
    }

    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("message", message);
        return error;
    }
}
