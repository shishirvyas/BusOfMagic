package com.magicbus.repository;

import com.magicbus.entity.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StateRepository extends JpaRepository<State, Long> {
    
    List<State> findByIsActiveTrueOrderByStateName();
    
    List<State> findAllByOrderByStateName();
    
    Optional<State> findByStateCode(String stateCode);
    
    Optional<State> findByStateName(String stateName);
    
    boolean existsByStateCode(String stateCode);
    
    boolean existsByStateName(String stateName);
    
    @Query("SELECT s FROM State s WHERE LOWER(s.stateName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(s.stateCode) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<State> searchStates(String search);
}
