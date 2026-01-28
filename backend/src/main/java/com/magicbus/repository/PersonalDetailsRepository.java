package com.magicbus.repository;

import com.magicbus.entity.PersonalDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PersonalDetailsRepository extends JpaRepository<PersonalDetails, Long> {
    Optional<PersonalDetails> findByCandidateId(Long candidateId);
}
