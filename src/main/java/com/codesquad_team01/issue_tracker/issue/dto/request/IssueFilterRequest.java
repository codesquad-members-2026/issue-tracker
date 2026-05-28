package com.codesquad_team01.issue_tracker.issue.dto.request;

import java.util.List;

public record IssueFilterRequest(
        Boolean isOpened,
        Long authorId,
        List<Long> assigneeIds,
        Long commentAuthorId,
        Long milestoneId,
        List<Long> labelIds
) {}
