package com.magicbus.service;

import com.magicbus.dto.*;
import com.magicbus.entity.*;
import com.magicbus.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class SignupService {
    
    private final CandidateRepository candidateRepository;
    private final OtpVerificationRepository otpVerificationRepository;
    private final PersonalDetailsRepository personalDetailsRepository;
    private final EducationDetailsRepository educationDetailsRepository;
    private final CandidateSkillRepository candidateSkillRepository;
    private final CandidateLanguageRepository candidateLanguageRepository;
    private final OnboardingProgressRepository onboardingProgressRepository;
    private final AuditLogRepository auditLogRepository;
    
    // Constants
    private static final int OTP_VALIDITY_MINUTES = 10;
    private static final int OTP_LENGTH = 6;
    
    /**
     * Step 1: Send OTP to email or phone
     */
    public String sendOtp(SendOtpRequest request) {
        // Normalize contact type - accept both PHONE and MOBILE
        String normalizedContactType = normalizeContactType(request.getContactType());
        log.info("Sending OTP to {} via {}", request.getContact(), normalizedContactType);
        
        // Use static OTP "0000" for testing (REMOVE IN PRODUCTION - use generateOtp() instead)
        String otpCode = "0000";
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiresAt = now.plusMinutes(OTP_VALIDITY_MINUTES);
        
        // Check if OTP already exists for this contact
        otpVerificationRepository.findByContactAndIsVerifiedFalse(request.getContact())
            .ifPresent(otpVerificationRepository::delete);
        
        // Create new OTP record
        OtpVerification otp = OtpVerification.builder()
            .contact(request.getContact())
            .contactType(normalizedContactType)
            .otpCode(otpCode)
            .isVerified(false)
            .attempts(0)
            .maxAttempts(5)
            .createdAt(now)
            .expiresAt(expiresAt)
            .build();
        
        otpVerificationRepository.save(otp);
        
        log.info("OTP sent successfully. Test Code: 0000 (Testing Mode)");
        
        // In production, actually send via SMS/Email here
        // For now, return the OTP for testing purposes (REMOVE IN PRODUCTION)
        return otpCode;
    }
    
    /**
     * Normalize contact type - accepts EMAIL, PHONE, or MOBILE (converts MOBILE to PHONE)
     */
    private String normalizeContactType(String contactType) {
        if (contactType == null) {
            return "EMAIL";
        }
        String normalized = contactType.toUpperCase().trim();
        if ("MOBILE".equals(normalized)) {
            return "PHONE";
        }
        return normalized;
    }
    
    /**
     * Step 2: Verify OTP
     */
    public Long verifyOtp(VerifyOtpRequest request) {
        log.info("Verifying OTP for contact: {}", request.getContact());
        
        OtpVerification otp = otpVerificationRepository.findByContactAndOtpCode(
                request.getContact(), request.getOtpCode())
            .orElseThrow(() -> new RuntimeException("Invalid OTP"));
        
        // Check if expired
        if (LocalDateTime.now().isAfter(otp.getExpiresAt())) {
            throw new RuntimeException("OTP expired");
        }
        
        // Check attempts
        if (otp.getAttempts() >= otp.getMaxAttempts()) {
            throw new RuntimeException("Maximum OTP attempts exceeded");
        }
        
        // Check if code matches
        if (!otp.getOtpCode().equals(request.getOtpCode())) {
            otp.setAttempts(otp.getAttempts() + 1);
            otpVerificationRepository.save(otp);
            throw new RuntimeException("Invalid OTP code");
        }
        
        // Mark as verified
        otp.setIsVerified(true);
        otp.setVerifiedAt(LocalDateTime.now());
        otpVerificationRepository.save(otp);
        
        log.info("OTP verified successfully for: {}", request.getContact());
        
        // Create or update candidate with verified contact
        Candidate candidate = createCandidateFromOtp(request.getContact(), request.getContact().contains("@") ? "EMAIL" : "PHONE");
        
        return candidate.getId();
    }
    
    /**
     * Create candidate from OTP verification
     */
    private Candidate createCandidateFromOtp(String contact, String contactType) {
        LocalDateTime now = LocalDateTime.now();
        
        if ("EMAIL".equals(contactType)) {
            return candidateRepository.findByEmail(contact)
                .orElseGet(() -> {
                    Candidate candidate = Candidate.builder()
                        .email(contact)
                        .phoneNumber("PENDING")  // Will be filled in personal details
                        .firstName("PENDING")
                        .lastName("PENDING")
                        .gender("PENDING")
                        .status("ACTIVE")
                        .addressLine1("PENDING")
                        .city("PENDING")
                        .state("PENDING")
                        .pincode("PENDING")
                        .dateOfBirth(LocalDate.now())
                        .createdAt(now)
                        .updatedAt(now)
                        .build();
                    return candidateRepository.save(candidate);
                });
        } else {
            return candidateRepository.findByPhoneNumber(contact)
                .orElseGet(() -> {
                    Candidate candidate = Candidate.builder()
                        .phoneNumber(contact)
                        .email("PENDING")  // Will be filled in personal details
                        .firstName("PENDING")
                        .lastName("PENDING")
                        .gender("PENDING")
                        .status("ACTIVE")
                        .addressLine1("PENDING")
                        .city("PENDING")
                        .state("PENDING")
                        .pincode("PENDING")
                        .dateOfBirth(LocalDate.now())
                        .createdAt(now)
                        .updatedAt(now)
                        .build();
                    return candidateRepository.save(candidate);
                });
        }
    }
    
    /**
     * Save profile details (name and DOB) after OTP verification
     */
    public void saveProfileDetails(ProfileDetailsDto dto) {
        log.info("Saving profile details for candidate: {}", dto.getCandidateId());
        
        Candidate candidate = candidateRepository.findById(dto.getCandidateId())
            .orElseThrow(() -> new RuntimeException("Candidate not found"));
        
        candidate.setFirstName(dto.getFirstName());
        candidate.setLastName(dto.getLastName());
        candidate.setDateOfBirth(dto.getDateOfBirth());
        candidate.setUpdatedAt(LocalDateTime.now());
        
        candidateRepository.save(candidate);
        
        log.info("Profile details saved successfully for candidate: {}", dto.getCandidateId());
    }
    
    /**
     * Step 3: Save Personal Details
     * This method saves both:
     * - Basic candidate info (name, contact, address, ID docs) to Candidate entity
     * - Employment/preference info to PersonalDetails entity
     */
    public void savePersonalDetails(PersonalDetailsDto dto) {
        log.info("Saving personal details for candidate: {}", dto.getCandidateId());
        
        Candidate candidate = candidateRepository.findById(dto.getCandidateId())
            .orElseThrow(() -> new RuntimeException("Candidate not found"));
        
        // ========== Update Candidate entity with basic information ==========
        if (dto.getFirstName() != null && !dto.getFirstName().isEmpty()) {
            candidate.setFirstName(dto.getFirstName());
        }
        if (dto.getLastName() != null && !dto.getLastName().isEmpty()) {
            candidate.setLastName(dto.getLastName());
        }
        if (dto.getEmail() != null && !dto.getEmail().isEmpty()) {
            candidate.setEmail(dto.getEmail());
        }
        if (dto.getPhone() != null && !dto.getPhone().isEmpty()) {
            candidate.setPhoneNumber(dto.getPhone());
        }
        if (dto.getDateOfBirth() != null) {
            candidate.setDateOfBirth(dto.getDateOfBirth());
        }
        if (dto.getGender() != null && !dto.getGender().isEmpty()) {
            candidate.setGender(dto.getGender());
        }
        if (dto.getAddress() != null && !dto.getAddress().isEmpty()) {
            candidate.setAddressLine1(dto.getAddress());
        }
        if (dto.getCity() != null && !dto.getCity().isEmpty()) {
            candidate.setCity(dto.getCity());
        }
        if (dto.getState() != null && !dto.getState().isEmpty()) {
            candidate.setState(dto.getState());
        }
        if (dto.getPincode() != null && !dto.getPincode().isEmpty()) {
            candidate.setPincode(dto.getPincode());
        }
        if (dto.getAadhar() != null && !dto.getAadhar().isEmpty()) {
            candidate.setAadharNumber(dto.getAadhar());
        }
        if (dto.getPan() != null && !dto.getPan().isEmpty()) {
            candidate.setPanNumber(dto.getPan());
        }
        candidate.setUpdatedAt(LocalDateTime.now());
        candidateRepository.save(candidate);
        log.info("Updated Candidate entity with basic info");
        
        // ========== Update PersonalDetails entity with additional info ==========
        PersonalDetails personalDetails = personalDetailsRepository.findByCandidateId(dto.getCandidateId())
            .orElseGet(() -> PersonalDetails.builder().candidate(candidate).build());
        
        // Bank account info
        if (dto.getBankAccount() != null && !dto.getBankAccount().isEmpty()) {
            personalDetails.setBankAccountNumber(dto.getBankAccount());
        }
        if (dto.getIfscCode() != null) {
            personalDetails.setIfscCode(dto.getIfscCode());
        }
        if (dto.getBankName() != null) {
            personalDetails.setBankName(dto.getBankName());
        }
        if (dto.getAccountHolderName() != null) {
            personalDetails.setAccountHolderName(dto.getAccountHolderName());
        }
        
        // Employment & Career info
        personalDetails.setEmploymentStatus(dto.getEmploymentStatus());
        personalDetails.setCurrentJobTitle(dto.getCurrentJobTitle());
        personalDetails.setCurrentCompanyName(dto.getCurrentCompanyName());
        personalDetails.setCareerInterests(dto.getCareerInterests());
        personalDetails.setPreferredJobRoles(dto.getPreferredJobRoles());
        personalDetails.setPreferredLocations(dto.getPreferredLocations());
        personalDetails.setPreferredJobTypes(dto.getPreferredJobTypes());
        personalDetails.setHasDisability(dto.getHasDisability());
        personalDetails.setDisabilityType(dto.getDisabilityType());
        personalDetails.setIsFirstGenerationLearner(dto.getIsFirstGenerationLearner());
        personalDetails.setMigrationStatus(dto.getMigrationStatus());
        personalDetails.setAvailabilityToRelocate(dto.getAvailabilityToRelocate());
        personalDetails.setAvailabilityForInternship(dto.getAvailabilityForInternship());
        personalDetails.setUpdatedAt(LocalDateTime.now());
        
        personalDetailsRepository.save(personalDetails);
        
        // Update onboarding progress
        updateOnboardingProgress(candidate.getId(), "personal_details_completed", true);
        
        log.info("Personal details saved successfully");
    }
    
    /**
     * Step 4: Save Education Details
     * Handles both simplified frontend field names and detailed field names
     */
    public void saveEducationDetails(EducationDetailsDto dto) {
        log.info("Saving education details for candidate: {}", dto.getCandidateId());
        
        Candidate candidate = candidateRepository.findById(dto.getCandidateId())
            .orElseThrow(() -> new RuntimeException("Candidate not found"));
        
        EducationDetails educationDetails = educationDetailsRepository.findByCandidateId(dto.getCandidateId())
            .orElseGet(() -> EducationDetails.builder().candidate(candidate).build());
        
        // ========== 10th Standard ==========
        // Accept either frontend simplified names OR detailed field names
        String tenthBoard = dto.getEducation10th() != null ? dto.getEducation10th() : dto.getTenthBoard();
        if (tenthBoard != null && !tenthBoard.isEmpty()) {
            educationDetails.setTenthBoard(tenthBoard);
        }
        
        // Parse score10th to BigDecimal if provided
        if (dto.getScore10th() != null && !dto.getScore10th().isEmpty()) {
            try {
                String scoreStr = dto.getScore10th().replace("%", "").trim();
                educationDetails.setTenthPercentage(new java.math.BigDecimal(scoreStr));
            } catch (NumberFormatException e) {
                log.warn("Could not parse 10th score: {}", dto.getScore10th());
            }
        } else if (dto.getTenthPercentage() != null) {
            educationDetails.setTenthPercentage(dto.getTenthPercentage());
        }
        
        if (dto.getTenthYearOfPassing() != null) {
            educationDetails.setTenthYearOfPassing(dto.getTenthYearOfPassing());
        }
        if (dto.getTenthStream() != null) {
            educationDetails.setTenthStream(dto.getTenthStream());
        }
        if (dto.getTenthSchoolName() != null) {
            educationDetails.setTenthSchoolName(dto.getTenthSchoolName());
        }
        
        // ========== 12th Standard ==========
        String twelfthBoard = dto.getEducation12th() != null ? dto.getEducation12th() : dto.getTwelfthBoard();
        if (twelfthBoard != null && !twelfthBoard.isEmpty()) {
            educationDetails.setTwelfthBoard(twelfthBoard);
        }
        
        // Parse score12th to BigDecimal if provided
        if (dto.getScore12th() != null && !dto.getScore12th().isEmpty()) {
            try {
                String scoreStr = dto.getScore12th().replace("%", "").trim();
                educationDetails.setTwelfthPercentage(new java.math.BigDecimal(scoreStr));
            } catch (NumberFormatException e) {
                log.warn("Could not parse 12th score: {}", dto.getScore12th());
            }
        } else if (dto.getTwelfthPercentage() != null) {
            educationDetails.setTwelfthPercentage(dto.getTwelfthPercentage());
        }
        
        if (dto.getTwelfthYearOfPassing() != null) {
            educationDetails.setTwelfthYearOfPassing(dto.getTwelfthYearOfPassing());
        }
        if (dto.getTwelfthStream() != null) {
            educationDetails.setTwelfthStream(dto.getTwelfthStream());
        }
        if (dto.getTwelfthCollegeName() != null) {
            educationDetails.setTwelfthCollegeName(dto.getTwelfthCollegeName());
        }
        
        // ========== Graduation ==========
        if (dto.getGraduationDegree() != null && !dto.getGraduationDegree().isEmpty()) {
            educationDetails.setGraduationDegree(dto.getGraduationDegree());
        }
        
        String gradSpec = dto.getGraduationField() != null ? dto.getGraduationField() : dto.getGraduationSpecialization();
        if (gradSpec != null && !gradSpec.isEmpty()) {
            educationDetails.setGraduationSpecialization(gradSpec);
        }
        
        // Parse graduationScore to BigDecimal if provided
        if (dto.getGraduationScore() != null && !dto.getGraduationScore().isEmpty()) {
            try {
                String scoreStr = dto.getGraduationScore().replace("%", "").trim();
                educationDetails.setGraduationPercentage(new java.math.BigDecimal(scoreStr));
            } catch (NumberFormatException e) {
                log.warn("Could not parse graduation score: {}", dto.getGraduationScore());
            }
        } else if (dto.getGraduationPercentage() != null) {
            educationDetails.setGraduationPercentage(dto.getGraduationPercentage());
        }
        
        if (dto.getGraduationYear() != null) {
            educationDetails.setGraduationYear(dto.getGraduationYear());
        }
        if (dto.getGraduationUniversity() != null) {
            educationDetails.setGraduationUniversity(dto.getGraduationUniversity());
        }
        
        if (dto.getCertifications() != null) {
            educationDetails.setCertifications(dto.getCertifications());
        }
        educationDetails.setUpdatedAt(LocalDateTime.now());
        
        educationDetailsRepository.save(educationDetails);
        
        // Update onboarding progress
        updateOnboardingProgress(candidate.getId(), "education_details_completed", true);
        
        log.info("Education details saved successfully");
    }
    
    /**
     * Step 5: Save Skills and Languages
     */
    public void saveSkillsAndLanguages(SkillsAndLanguagesDto dto) {
        log.info("Saving skills and languages for candidate: {}", dto.getCandidateId());
        
        Candidate candidate = candidateRepository.findById(dto.getCandidateId())
            .orElseThrow(() -> new RuntimeException("Candidate not found"));
        
        // Clear existing skills
        candidateSkillRepository.deleteByCandidateId(candidate.getId());
        
        // Save new skills
        if (dto.getSkills() != null) {
            dto.getSkills().forEach(skillDto -> {
                CandidateSkill skill = CandidateSkill.builder()
                    .candidate(candidate)
                    .skillName(skillDto.getSkillName())
                    .proficiencyLevel(skillDto.getProficiencyLevel())
                    .build();
                candidateSkillRepository.save(skill);
            });
        }
        
        // Clear existing languages
        candidateLanguageRepository.deleteByCandidateId(candidate.getId());
        
        // Save new languages
        if (dto.getLanguages() != null) {
            dto.getLanguages().forEach(langDto -> {
                CandidateLanguage language = CandidateLanguage.builder()
                    .candidate(candidate)
                    .languageName(langDto.getLanguageName())
                    .proficiencyLevel(langDto.getProficiencyLevel())
                    .build();
                candidateLanguageRepository.save(language);
            });
        }
        
        // Update onboarding progress
        updateOnboardingProgress(candidate.getId(), "skills_completed", true);
        
        log.info("Skills and languages saved successfully");
    }
    
    /**
     * Step 6: Complete signup
     */
    public void completeSignup(Long candidateId) {
        log.info("Completing signup for candidate: {}", candidateId);
        
        Candidate candidate = candidateRepository.findById(candidateId)
            .orElseThrow(() -> new RuntimeException("Candidate not found"));
        
        // Update candidate status to ACTIVE
        candidate.setStatus("ACTIVE");
        candidateRepository.save(candidate);
        
        // Update onboarding progress
        OnboardingProgress progress = onboardingProgressRepository.findByCandidateId(candidateId)
            .orElseGet(() -> OnboardingProgress.builder().candidate(candidate).build());
        
        progress.setSignupCompleted(true);
        progress.setSignupCompletedAt(LocalDateTime.now());
        progress.setOverallCompleted(true);
        progress.setOverallCompletedAt(LocalDateTime.now());
        progress.setProgressPercentage(new java.math.BigDecimal(100));
        progress.setUpdatedAt(LocalDateTime.now());
        
        onboardingProgressRepository.save(progress);
        
        log.info("Signup completed successfully for candidate: {}", candidateId);
    }
    
    /**
     * Helper method to update onboarding progress
     */
    private void updateOnboardingProgress(Long candidateId, String stepKey, boolean completed) {
        OnboardingProgress progress = onboardingProgressRepository.findByCandidateId(candidateId)
            .orElseGet(() -> OnboardingProgress.builder()
                .candidate(candidateRepository.findById(candidateId).orElse(null))
                .build());
        
        if (progress.getCandidate() == null) {
            progress.setCandidate(candidateRepository.findById(candidateId).orElse(null));
        }
        
        switch (stepKey) {
            case "personal_details_completed":
                progress.setPersonalDetailsCompleted(completed);
                progress.setPersonalDetailsCompletedAt(completed ? LocalDateTime.now() : null);
                progress.setCurrentStep("personal");
                break;
            case "education_details_completed":
                progress.setEducationDetailsCompleted(completed);
                progress.setEducationDetailsCompletedAt(completed ? LocalDateTime.now() : null);
                progress.setCurrentStep("education");
                break;
            case "skills_completed":
                progress.setSkillsCompleted(completed);
                progress.setSkillsCompletedAt(completed ? LocalDateTime.now() : null);
                progress.setCurrentStep("skills");
                break;
        }
        
        // Calculate progress percentage
        int completedSteps = 0;
        if (progress.getPersonalDetailsCompleted()) completedSteps++;
        if (progress.getEducationDetailsCompleted()) completedSteps++;
        if (progress.getSkillsCompleted()) completedSteps++;
        progress.setProgressPercentage(new java.math.BigDecimal(completedSteps * 33));
        
        progress.setUpdatedAt(LocalDateTime.now());
        onboardingProgressRepository.save(progress);
    }
    
    /**
     * Generate OTP code
     */
    private String generateOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
}
