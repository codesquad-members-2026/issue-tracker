package com.codesquad_team01.issue_tracker.issue.dto.request;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record IssueWriteRequest(
        String title,
        @NotBlank(message = "본문은 최소 한 글자 이상 들어가야 합니다.")
        String contents,

        List<Long> assigneeIds,
        List<Long> labelIds,
        Long milestoneId
) {

    public IssueWriteRequest {

        assigneeIds = assigneeIds != null ? assigneeIds : List.of();
        labelIds = labelIds != null ? labelIds : List.of();
    }
}
