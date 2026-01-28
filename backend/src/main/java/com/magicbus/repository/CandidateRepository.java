package com.magicbus.repository;

import com.magicbus.entity.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, Long> {
    
    // Find by email
    Optional<Candidate> findByEmail(String email);
    
    // Find by phone
    Optional<Candidate> findByPhoneNumber(String phoneNumber);
    
    // Find all active candidates
    @Query("SELECT c FROM Candidate c WHERE c.status = 'ACTIVE' ORDER BY c.createdAt DESC")
    List<Candidate> findAllActiveCandidates();
    
    // Find by city and state
    @Query("SELECT c FROM Candidate c WHERE c.city = :city AND c.state = :state")
    List<Candidate> findByCityAndState(@Param("city") String city, @Param("state") String state);
    
    // Find candidates at risk
    @Query("SELECT c FROM Candidate c WHERE c.dropoutRiskScore >= :riskThreshold ORDER BY c.dropoutRiskScore DESC")
    List<Candidate> findAtRiskCandidates(@Param("riskThreshold") Integer riskThreshold);
    
    // Count by onboarding status
    Long countByOnboardingStatus(String onboardingStatus);
    
    // Count by onboarding status and month/year
    @Query("SELECT COUNT(c) FROM Candidate c WHERE c.onboardingStatus = :status " +
           "AND YEAR(c.createdAt) = :year AND MONTH(c.createdAt) = :month")
    Long countByOnboardingStatusAndMonth(@Param("status") String status, 
                                         @Param("year") int year, 
                                         @Param("month") int month);
    
    // Count by onboarding status and year only
    @Query("SELECT COUNT(c) FROM Candidate c WHERE c.onboardingStatus = :status " +
           "AND YEAR(c.createdAt) = :year")
    Long countByOnboardingStatusAndYear(@Param("status") String status, 
                                        @Param("year") int year);
    
    // Count all candidates by year
    @Query("SELECT COUNT(c) FROM Candidate c WHERE YEAR(c.createdAt) = :year")
    Long countByYear(@Param("year") int year);
}
