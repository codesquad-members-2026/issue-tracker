package com.codesquad_team01.issue_tracker.milestone.dto.response;

import java.util.List;

public record MilestoneListResponse(
        MilestoneMetaData milestoneMetaData,
        List<MilestoneListItemResponse> milestones
) {
}
