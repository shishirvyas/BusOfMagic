package com.magicbus.controller.menu;

import com.magicbus.dto.menu.MenuGroupDTO;
import com.magicbus.dto.menu.MenuItemDTO;
import com.magicbus.entity.auth.AdminUser;
import com.magicbus.repository.auth.AdminUserRepository;
import com.magicbus.service.menu.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/menu")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;
    private final AdminUserRepository adminUserRepository;

    @GetMapping
    public ResponseEntity<List<MenuItemDTO>> getMenuForUser(
            @RequestHeader(value = "X-User-Permissions", required = false) String permissionsHeader,
            @RequestHeader(value = "Authorization", required = false) String authToken) {
        
        List<String> permissions;
        
        // First try to get permissions from auth token
        if (authToken != null && !authToken.isEmpty()) {
            permissions = getUserPermissions(authToken);
        } else if (permissionsHeader != null && !permissionsHeader.isEmpty()) {
            permissions = Arrays.asList(permissionsHeader.split(","));
        } else {
            permissions = List.of();
        }
        
        return ResponseEntity.ok(menuService.getMenuItemsForUser(permissions));
    }

    @GetMapping("/grouped")
    public ResponseEntity<List<MenuGroupDTO>> getGroupedMenu(
            @RequestHeader(value = "Authorization", required = false) String authToken) {
        
        if (authToken == null || authToken.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }
        
        List<String> permissions = getUserPermissions(authToken);
        return ResponseEntity.ok(menuService.getGroupedMenuForUser(permissions));
    }

    @GetMapping("/groups")
    public ResponseEntity<List<MenuGroupDTO>> getAllMenuGroups() {
        return ResponseEntity.ok(menuService.getAllMenuGroups());
    }

    @GetMapping("/all")
    public ResponseEntity<List<MenuItemDTO>> getAllMenuItems() {
        return ResponseEntity.ok(menuService.getAllMenuItems());
    }

    private List<String> getUserPermissions(String token) {
        AdminUser user = adminUserRepository.findByAuthToken(token).orElse(null);
        if (user == null || user.getRole() == null) {
            return List.of();
        }
        
        return user.getRole().getPermissions().stream()
            .map(p -> p.getCode())
            .collect(Collectors.toList());
    }
}
