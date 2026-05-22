package com.codesquad_team01.issue_tracker.member.dto.request;

import java.util.List;

public record IssueAssigneesUpdateRequest(
        List<Long> assigneeIds
) {
}