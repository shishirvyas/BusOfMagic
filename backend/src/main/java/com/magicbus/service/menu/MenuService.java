package com.magicbus.service.menu;

import com.magicbus.dto.menu.MenuGroupDTO;
import com.magicbus.dto.menu.MenuItemDTO;
import com.magicbus.entity.menu.MenuGroup;
import com.magicbus.entity.menu.MenuItem;
import com.magicbus.repository.menu.MenuGroupRepository;
import com.magicbus.repository.menu.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuItemRepository menuItemRepository;
    private final MenuGroupRepository menuGroupRepository;

    public List<MenuItemDTO> getMenuItemsForUser(List<String> userPermissions) {
        // Get all accessible menu items based on permissions
        List<MenuItem> menuItems = menuItemRepository.findAccessibleMenuItems(userPermissions);
        
        // Build hierarchical menu structure
        return buildMenuTree(menuItems);
    }

    public List<MenuGroupDTO> getGroupedMenuForUser(List<String> userPermissions) {
        // Get all menu groups
        List<MenuGroup> groups = menuGroupRepository.findByIsActiveTrueOrderBySortOrder();
        
        // Get accessible menu items
        List<MenuItem> accessibleItems = menuItemRepository.findAccessibleMenuItems(userPermissions);
        Set<Long> accessibleItemIds = accessibleItems.stream()
            .map(MenuItem::getId)
            .collect(Collectors.toSet());
        
        // Build grouped menu structure
        List<MenuGroupDTO> result = new ArrayList<>();
        
        for (MenuGroup group : groups) {
            List<MenuItemDTO> groupItems = accessibleItems.stream()
                .filter(item -> item.getMenuGroup() != null && 
                               item.getMenuGroup().getId().equals(group.getId()))
                .sorted(Comparator.comparingInt(MenuItem::getSortOrder))
                .map(this::mapToDTO)
                .collect(Collectors.toList());
            
            // Only include groups that have accessible items
            if (!groupItems.isEmpty()) {
                result.add(MenuGroupDTO.builder()
                    .id(group.getId())
                    .name(group.getName())
                    .label(group.getLabel())
                    .icon(group.getIcon())
                    .sortOrder(group.getSortOrder())
                    .isActive(group.getIsActive())
                    .menuItems(groupItems)
                    .build());
            }
        }
        
        // Add ungrouped items as a special "Other" group
        List<MenuItemDTO> ungroupedItems = accessibleItems.stream()
            .filter(item -> item.getMenuGroup() == null)
            .sorted(Comparator.comparingInt(MenuItem::getSortOrder))
            .map(this::mapToDTO)
            .collect(Collectors.toList());
        
        if (!ungroupedItems.isEmpty()) {
            result.add(MenuGroupDTO.builder()
                .id(0L)
                .name("other")
                .label("Other")
                .icon("MoreHoriz")
                .sortOrder(999)
                .isActive(true)
                .menuItems(ungroupedItems)
                .build());
        }
        
        return result;
    }

    public List<MenuItemDTO> getAllMenuItems() {
        List<MenuItem> menuItems = menuItemRepository.findByIsActiveTrueOrderBySortOrder();
        return buildMenuTree(menuItems);
    }

    public List<MenuGroupDTO> getAllMenuGroups() {
        return menuGroupRepository.findByIsActiveTrueOrderBySortOrder().stream()
            .map(this::mapGroupToDTO)
            .collect(Collectors.toList());
    }

    private List<MenuItemDTO> buildMenuTree(List<MenuItem> menuItems) {
        // Group by parent
        Map<Long, List<MenuItem>> childrenMap = menuItems.stream()
            .filter(m -> m.getParent() != null)
            .collect(Collectors.groupingBy(m -> m.getParent().getId()));

        // Get top-level items
        List<MenuItemDTO> result = menuItems.stream()
            .filter(m -> m.getParent() == null)
            .map(m -> mapToDTO(m, childrenMap))
            .collect(Collectors.toList());

        return result;
    }

    private MenuItemDTO mapToDTO(MenuItem item, Map<Long, List<MenuItem>> childrenMap) {
        List<MenuItemDTO> children = new ArrayList<>();
        
        if (childrenMap.containsKey(item.getId())) {
            children = childrenMap.get(item.getId()).stream()
                .map(child -> mapToDTO(child, childrenMap))
                .collect(Collectors.toList());
        }

        return MenuItemDTO.builder()
            .id(item.getId())
            .name(item.getName())
            .label(item.getLabel())
            .icon(item.getIcon())
            .path(item.getPath())
            .parentId(item.getParent() != null ? item.getParent().getId() : null)
            .menuGroupId(item.getMenuGroup() != null ? item.getMenuGroup().getId() : null)
            .menuGroupName(item.getMenuGroup() != null ? item.getMenuGroup().getLabel() : null)
            .sortOrder(item.getSortOrder())
            .requiredPermission(item.getRequiredPermission() != null ? 
                item.getRequiredPermission().getCode() : null)
            .isActive(item.getIsActive())
            .children(children.isEmpty() ? null : children)
            .build();
    }

    private MenuItemDTO mapToDTO(MenuItem item) {
        return mapToDTO(item, Collections.emptyMap());
    }

    private MenuGroupDTO mapGroupToDTO(MenuGroup group) {
        return MenuGroupDTO.builder()
            .id(group.getId())
            .name(group.getName())
            .label(group.getLabel())
            .icon(group.getIcon())
            .sortOrder(group.getSortOrder())
            .isActive(group.getIsActive())
            .menuItems(null) // Don't load items for simple listing
            .build();
    }
}
