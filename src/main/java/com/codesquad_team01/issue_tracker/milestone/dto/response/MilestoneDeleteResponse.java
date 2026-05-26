package com.codesquad_team01.issue_tracker.milestone.dto.response;

public record MilestoneDeleteResponse (
        Long deletedMilestoneId
) {

    public static MilestoneDeleteResponse from(Long milestoneId) {
        return new MilestoneDeleteResponse(milestoneId);
    }
}
