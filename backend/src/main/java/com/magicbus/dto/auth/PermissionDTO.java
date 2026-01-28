package com.magicbus.dto.auth;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PermissionDTO {
    private Long id;
    private String name;
    private String code;
    private String description;
    private String module;
    private Boolean isActive;
}
