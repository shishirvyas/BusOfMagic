package com.magicbus.repository;

import com.magicbus.entity.SkillAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillAssessmentRepository extends JpaRepository<SkillAssessment, Long> {
    List<SkillAssessment> findByCandidateId(Long candidateId);
}
