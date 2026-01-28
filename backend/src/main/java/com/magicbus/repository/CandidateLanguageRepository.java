package com.magicbus.repository;

import com.magicbus.entity.CandidateLanguage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CandidateLanguageRepository extends JpaRepository<CandidateLanguage, Long> {
    List<CandidateLanguage> findByCandidateId(Long candidateId);
    void deleteByCandidateId(Long candidateId);
}
