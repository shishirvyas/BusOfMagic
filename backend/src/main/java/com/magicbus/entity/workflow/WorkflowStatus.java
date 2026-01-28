package com.magicbus.entity.workflow;

public enum WorkflowStatus {
    PENDING_SCREENING("Pending Screening"),
    PENDING_ORIENTATION("Pending Orientation"),
    PENDING_ENROLL("Pending Enrollment"),
    ENROLLED("Enrolled"),
    DROPPED("Dropped"),
    ON_HOLD("On Hold");

    private final String displayName;

    WorkflowStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
