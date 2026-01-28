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
    
    @Query("SELECT a FROM AdminUser a " +
           "LEFT JOIN FETCH a.role r " +
           "LEFT JOIN FETCH r.permissions " +
           "LEFT JOIN FETCH a.state " +
           "LEFT JOIN FETCH a.city " +
           "WHERE a.username = :username AND a.password = :password")
    Optional<AdminUser> findByUsernameAndPassword(@Param("username") String username, 
                                                   @Param("password") String password);
    
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
    
    @Query("SELECT a FROM AdminUser a " +
           "LEFT JOIN FETCH a.role r " +
           "LEFT JOIN FETCH r.permissions " +
           "LEFT JOIN FETCH a.state " +
           "LEFT JOIN FETCH a.city " +
           "WHERE a.authToken = :authToken")
    Optional<AdminUser> findByAuthToken(@Param("authToken") String authToken);
}
