package com.magicbus.repository;

import com.magicbus.entity.CandidateAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CandidateAnswerRepository extends JpaRepository<CandidateAnswer, Long> {
    
    List<CandidateAnswer> findByCandidateId(Long candidateId);
    
    Optional<CandidateAnswer> findByCandidateIdAndQuestionId(Long candidateId, Long questionId);
    
    @Query("SELECT ca FROM CandidateAnswer ca WHERE ca.candidate.id = :candidateId AND ca.isSubmitted = true")
    List<CandidateAnswer> findSubmittedAnswersByCandidateId(@Param("candidateId") Long candidateId);
    
    long countByCandidateIdAndIsSubmittedTrue(Long candidateId);
    
    void deleteByCandidateId(Long candidateId);
}
