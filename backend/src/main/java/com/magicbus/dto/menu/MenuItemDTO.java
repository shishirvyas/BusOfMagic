package com.magicbus.dto.menu;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuItemDTO {
    private Long id;
    private String name;
    private String label;
    private String icon;
    private String path;
    private Long parentId;
    private Long menuGroupId;
    private String menuGroupName;
    private Integer sortOrder;
    private String requiredPermission;
    private Boolean isActive;
    private List<MenuItemDTO> children;
}
