package com.codesquad_team01.issue_tracker.comment.controller;

import com.codesquad_team01.issue_tracker.comment.dto.request.CommentRequest;
import com.codesquad_team01.issue_tracker.comment.dto.response.CommentResponse;
import com.codesquad_team01.issue_tracker.comment.service.CommentService;
import com.codesquad_team01.issue_tracker.global.dto.ApiResponse;
import com.codesquad_team01.issue_tracker.comment.dto.mapper.CommentDtoMapper;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Validated
public class CommentController {

    private final CommentService commentService;
    private final CommentDtoMapper commentDtoMapper;

    @PostMapping("/api/issues/{issueId}/comments")
    public ApiResponse<CommentResponse> createComment(
            @PathVariable @Positive(message = "올바르지 않은 이슈 ID입니다.") Long issueId,
            @RequestBody @Valid CommentRequest commentRequest) {

        Long commentId = commentService.createComment(issueId, commentRequest);

        CommentResponse data = commentDtoMapper.toCommentResponse(commentId, commentRequest.contents());

        return ApiResponse.success("댓글 작성 완료", data);
    }

    @PatchMapping("/api/issues/{issueId}/comments/{commentId}")
    public ApiResponse<Void> updateComment(
            @PathVariable @Positive(message = "올바르지 않은 이슈 ID입니다.") Long issueId,
            @PathVariable @Positive(message = "올바르지 않은 댓글 ID입니다.") Long commentId,
            @RequestBody @Valid CommentRequest commentRequest) {

        commentService.updateComment(issueId, commentId, commentRequest);

        return ApiResponse.success("댓글 수정 완료", null);
    }
}