package com.magicbus.dto.auth;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUserDTO {
    private Long id;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private Long roleId;
    private String roleName;
    private Long stateId;
    private String stateName;
    private Long cityId;
    private String cityName;
    private Boolean isActive;
    private LocalDateTime lastLogin;
    private Long createdById;
    private String createdByName;
    private LocalDateTime createdAt;
    private List<String> permissions;
}
