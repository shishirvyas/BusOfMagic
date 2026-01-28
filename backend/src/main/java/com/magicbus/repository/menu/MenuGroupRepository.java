package com.magicbus.repository.menu;

import com.magicbus.entity.menu.MenuGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MenuGroupRepository extends JpaRepository<MenuGroup, Long> {
    
    Optional<MenuGroup> findByName(String name);
    
    List<MenuGroup> findByIsActiveTrueOrderBySortOrder();
    
    @Query("SELECT DISTINCT mg FROM MenuGroup mg " +
           "LEFT JOIN FETCH mg.menuItems mi " +
           "WHERE mg.isActive = true " +
           "ORDER BY mg.sortOrder")
    List<MenuGroup> findAllWithMenuItems();
}
