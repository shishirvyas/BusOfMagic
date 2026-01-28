package com.magicbus.repository.menu;

import com.magicbus.entity.menu.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    
    List<MenuItem> findByIsActiveTrueOrderBySortOrder();
    
    Optional<MenuItem> findByName(String name);
    
    @Query("SELECT m FROM MenuItem m WHERE m.parent IS NULL AND m.isActive = true ORDER BY m.sortOrder")
    List<MenuItem> findTopLevelMenuItems();
    
    @Query("SELECT m FROM MenuItem m WHERE m.parent.id = :parentId AND m.isActive = true ORDER BY m.sortOrder")
    List<MenuItem> findByParentId(@Param("parentId") Long parentId);
    
    @Query("SELECT m FROM MenuItem m WHERE m.requiredPermission.code IN :permissionCodes AND m.isActive = true ORDER BY m.sortOrder")
    List<MenuItem> findByPermissionCodes(@Param("permissionCodes") List<String> permissionCodes);
    
    @Query("SELECT m FROM MenuItem m WHERE (m.requiredPermission IS NULL OR m.requiredPermission.code IN :permissionCodes) AND m.isActive = true ORDER BY m.sortOrder")
    List<MenuItem> findAccessibleMenuItems(@Param("permissionCodes") List<String> permissionCodes);
}
