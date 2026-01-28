package com.magicbus.repository;

import com.magicbus.entity.EducationDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EducationDetailsRepository extends JpaRepository<EducationDetails, Long> {
    Optional<EducationDetails> findByCandidateId(Long candidateId);
}
