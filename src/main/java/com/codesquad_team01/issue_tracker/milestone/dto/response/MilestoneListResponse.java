package com.codesquad_team01.issue_tracker.milestone.dto.response;

import java.util.List;

public record MilestoneListResponse(
        List<MilestoneListItemResponse> milestones
) {
}
