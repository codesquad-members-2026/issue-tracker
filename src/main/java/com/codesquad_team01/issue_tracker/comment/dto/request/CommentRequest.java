package com.codesquad_team01.issue_tracker.comment.dto.request;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record CommentRequest(

        @NotBlank(message = "댓글 내용은 필수입니다.")
        String contents,
        List<Long> attachmentIds
) {
}