package com.magicbus.repository.auth;

import com.magicbus.entity.auth.AdminUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdminUserRepository extends JpaRepository<AdminUser, Long> {
    
    Optional<AdminUser> findByUsername(String username);
    
    Optional<AdminUser> findByUsernameAndPassword(String username, String password);
    
    boolean existsByUsername(String username);
    
    List<AdminUser> findByIsActiveTrue();
    
    @Query("SELECT a FROM AdminUser a WHERE a.state.id = :stateId")
    List<AdminUser> findByStateId(@Param("stateId") Long stateId);
    
    @Query("SELECT a FROM AdminUser a WHERE a.city.id = :cityId")
    List<AdminUser> findByCityId(@Param("cityId") Long cityId);
    
    @Query("SELECT a FROM AdminUser a WHERE a.createdBy.id = :createdById")
    List<AdminUser> findByCreatedById(@Param("createdById") Long createdById);
    
    @Query("SELECT a FROM AdminUser a WHERE a.role.name = :roleName")
    List<AdminUser> findByRoleName(@Param("roleName") String roleName);
    
    Optional<AdminUser> findByAuthToken(String authToken);
}
