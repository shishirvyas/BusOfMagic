package com.magicbus.dto.menu;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuGroupDTO {
    private Long id;
    private String name;
    private String label;
    private String icon;
    private Integer sortOrder;
    private Boolean isActive;
    private List<MenuItemDTO> menuItems;
}
