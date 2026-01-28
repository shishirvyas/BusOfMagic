package com.magicbus.service;

import com.magicbus.dto.OnboardingRequestDTO;
import com.magicbus.dto.OnboardingResponseDTO;
import com.magicbus.entity.*;
import com.magicbus.repository.CandidateRepository;
import com.magicbus.repository.EducationDetailsRepository;
import com.magicbus.repository.PersonalDetailsRepository;
import com.magicbus.repository.SkillAssessmentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Slf4j
@Service
public class OnboardingService {

    private final CandidateRepository candidateRepository;
    private final EducationDetailsRepository educationDetailsRepository;
    private final PersonalDetailsRepository personalDetailsRepository;
    private final SkillAssessmentRepository skillAssessmentRepository;

    public OnboardingService(
            CandidateRepository candidateRepository,
            EducationDetailsRepository educationDetailsRepository,
            PersonalDetailsRepository personalDetailsRepository,
            SkillAssessmentRepository skillAssessmentRepository) {
        this.candidateRepository = candidateRepository;
        this.educationDetailsRepository = educationDetailsRepository;
        this.personalDetailsRepository = personalDetailsRepository;
        this.skillAssessmentRepository = skillAssessmentRepository;
    }

    @Transactional
    public OnboardingResponseDTO onboardCandidate(OnboardingRequestDTO request) {
        try {
            log.info("Starting onboarding for candidate: {} {}", request.getFirstName(), request.getLastName());

            // Parse date of birth
            LocalDate dob = LocalDate.parse(request.getDateOfBirth());

            // Create Candidate entity
            Candidate candidate = Candidate.builder()
                    .firstName(request.getFirstName())
                    .lastName(request.getLastName())
                    .email(request.getEmail())
                    .phoneNumber(request.getPhone())
                    .dateOfBirth(dob)
                    .gender(request.getGender())
                    .addressLine1(request.getAddress())
                    .city(request.getCity())
                    .state(request.getState())
                    .pincode(request.getPincode())
                    .status("ACTIVE")
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            Candidate savedCandidate = candidateRepository.save(candidate);
            log.info("Candidate created with ID: {}", savedCandidate.getId());

            // Create Education Details
            if (request.getEducation10th() != null) {
                EducationDetails eduDetails = EducationDetails.builder()
                        .candidate(savedCandidate)
                        .tenthBoard(request.getEducation10th())
                        .tenthPercentage(parsePercentage(request.getScore10th()))
                        .twelfthBoard(request.getEducation12th())
                        .twelfthPercentage(parsePercentage(request.getScore12th()))
                        .graduationDegree(request.getGraduationDegree())
                        .graduationSpecialization(request.getGraduationField())
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build();

                educationDetailsRepository.save(eduDetails);
                log.info("Education details saved for candidate ID: {}", savedCandidate.getId());
            }

            // Create Personal Details
            PersonalDetails personalDetails = PersonalDetails.builder()
                    .candidate(savedCandidate)
                    .employmentStatus("UNEMPLOYED")
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            personalDetailsRepository.save(personalDetails);
            log.info("Personal details saved for candidate ID: {}", savedCandidate.getId());

            // Create Skill Assessments
            if (request.getSkills() != null && !request.getSkills().isEmpty()) {
                for (String skill : request.getSkills()) {
                    SkillAssessment skillAssessment = SkillAssessment.builder()
                            .candidate(savedCandidate)
                            .skillName(skill)
                            .proficiencyLevel("INTERMEDIATE") // Default level
                            .createdAt(LocalDateTime.now())
                            .updatedAt(LocalDateTime.now())
                            .build();

                    skillAssessmentRepository.save(skillAssessment);
                }
                log.info("Skill assessments saved for candidate ID: {} ({} skills)", 
                        savedCandidate.getId(), request.getSkills().size());
            }

            // Build response
            return OnboardingResponseDTO.builder()
                    .candidateId(savedCandidate.getId())
                    .firstName(savedCandidate.getFirstName())
                    .lastName(savedCandidate.getLastName())
                    .email(savedCandidate.getEmail())
                    .message(String.format("Candidate %s %s onboarded successfully",
                            savedCandidate.getFirstName(), savedCandidate.getLastName()))
                    .success(true)
                    .build();

        } catch (Exception e) {
            log.error("Error during onboarding: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to onboard candidate: " + e.getMessage());
        }
    }

    private BigDecimal parsePercentage(String percentage) {
        if (percentage == null || percentage.isEmpty()) {
            return BigDecimal.ZERO;
        }
        try {
            return new BigDecimal(percentage.replaceAll("[^0-9.]", ""));
        } catch (NumberFormatException e) {
            return BigDecimal.ZERO;
        }
    }
}
