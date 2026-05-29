package com.codesquad_team01.issue_tracker.issue.dto.response;

import com.codesquad_team01.issue_tracker.label.dto.response.LabelResponse;
import com.codesquad_team01.issue_tracker.member.dto.response.AuthorResponse;
import com.codesquad_team01.issue_tracker.milestone.dto.response.MilestoneResponse;

import java.time.LocalDateTime;
import java.util.List;

public record IssueResponse(

        Long id,
        String title,
        AuthorResponse author,
        List<LabelResponse> labels,
        MilestoneResponse milestone,
        boolean isOpened,
        LocalDateTime createdAt
) {
}
