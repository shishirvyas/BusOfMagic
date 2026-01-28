package com.magicbus.repository;

import com.magicbus.entity.OnboardingQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OnboardingQuestionRepository extends JpaRepository<OnboardingQuestion, Long> {
    
    List<OnboardingQuestion> findByIsActiveTrueOrderByDisplayOrderAsc();
    
    List<OnboardingQuestion> findByQuestionCategoryAndIsActiveTrueOrderByDisplayOrderAsc(String category);
    
    @Query("SELECT DISTINCT q.questionCategory FROM OnboardingQuestion q WHERE q.isActive = true ORDER BY q.questionCategory")
    List<String> findAllActiveCategories();
    
    long countByIsActiveTrue();
}
