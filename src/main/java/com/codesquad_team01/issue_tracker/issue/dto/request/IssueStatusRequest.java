package com.codesquad_team01.issue_tracker.issue.dto.request;

import com.codesquad_team01.issue_tracker.issue.domain.IssueStatus;
import jakarta.validation.constraints.NotNull;

public record IssueStatusRequest(
        @NotNull(message = "이슈 상태는 필수 값이며, OPEN 또는 CLOSED만 가능합니다.")
        IssueStatus status
) {
}