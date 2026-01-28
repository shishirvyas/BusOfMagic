package com.magicbus.repository;

import com.magicbus.entity.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CityRepository extends JpaRepository<City, Long> {
    
    List<City> findByStateIdOrderByCityName(Long stateId);
    
    List<City> findByStateIdAndIsActiveTrueOrderByCityName(Long stateId);
    
    List<City> findByIsActiveTrueOrderByCityName();
    
    List<City> findAllByOrderByCityName();
    
    Optional<City> findByCityNameAndStateId(String cityName, Long stateId);
    
    boolean existsByCityNameAndStateId(String cityName, Long stateId);
    
    @Query("SELECT c FROM City c WHERE LOWER(c.cityName) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<City> searchCities(String search);
    
    @Query("SELECT COUNT(c) FROM City c WHERE c.state.id = :stateId")
    Integer countByStateId(Long stateId);
}
