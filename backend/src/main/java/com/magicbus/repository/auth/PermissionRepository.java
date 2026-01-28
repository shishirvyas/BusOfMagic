package com.magicbus.repository.auth;

import com.magicbus.entity.auth.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {
    
    Optional<Permission> findByCode(String code);
    
    List<Permission> findByModule(String module);
    
    List<Permission> findByIsActiveTrue();
    
    Set<Permission> findByCodeIn(Collection<String> codes);
    
    boolean existsByCode(String code);
}
