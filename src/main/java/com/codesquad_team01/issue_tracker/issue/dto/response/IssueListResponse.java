package com.codesquad_team01.issue_tracker.issue.dto.response;

import java.util.List;

public record IssueListResponse(
        Metadata metadata,
        List<IssueResponse> issues
) {
    public record Metadata(
            long openIssueCount,
            long closedIssueCount,
            long labelCount,
            long milestoneCount
    ) {}
}