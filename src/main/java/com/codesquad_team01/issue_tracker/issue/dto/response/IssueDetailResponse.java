package com.codesquad_team01.issue_tracker.issue.dto.response;

import com.codesquad_team01.issue_tracker.comment.dto.response.CommentResponse;
import com.codesquad_team01.issue_tracker.label.dto.response.LabelResponse;
import com.codesquad_team01.issue_tracker.member.dto.response.AuthorResponse;
import com.codesquad_team01.issue_tracker.milestone.dto.response.MilestoneResponse;

import java.time.LocalDateTime;
import java.util.List;

public record IssueDetailResponse(
        Long id,
        String title,
        String contents,
        boolean isOpened,
        LocalDateTime createdAt,
        AuthorResponse author,
        long commentCount,
        List<CommentResponse> comments,
        List<AuthorResponse> assignees,
        List<LabelResponse> labels,
        MilestoneResponse milestone
) {

}
