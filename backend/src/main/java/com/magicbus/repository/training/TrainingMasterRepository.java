package com.magicbus.repository.training;

import com.magicbus.entity.training.TrainingMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TrainingMasterRepository extends JpaRepository<TrainingMaster, Long> {

    List<TrainingMaster> findByIsActiveTrue();

    List<TrainingMaster> findByIsActiveTrueOrderByNameAsc();

    List<TrainingMaster> findAllByOrderByCreatedAtDesc();

    Optional<TrainingMaster> findByName(String name);

    boolean existsByName(String name);

    @Query("SELECT tm FROM TrainingMaster tm " +
           "LEFT JOIN FETCH tm.batches b " +
           "WHERE tm.id = :id")
    Optional<TrainingMaster> findByIdWithBatches(Long id);

    List<TrainingMaster> findBySkillCategory(String skillCategory);

    @Query("SELECT DISTINCT tm.skillCategory FROM TrainingMaster tm WHERE tm.skillCategory IS NOT NULL")
    List<String> findAllSkillCategories();
}
