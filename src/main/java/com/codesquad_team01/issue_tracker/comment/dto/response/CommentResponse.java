package com.codesquad_team01.issue_tracker.comment.dto.response;

import com.codesquad_team01.issue_tracker.member.dto.response.AuthorResponse;
import java.time.LocalDateTime;

public record CommentResponse(
        Long id,
        AuthorResponse author,
        String contents,
        LocalDateTime createdAt,
        boolean isIssueAuthor
) {}