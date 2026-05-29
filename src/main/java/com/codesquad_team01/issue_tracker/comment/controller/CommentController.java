package com.codesquad_team01.issue_tracker.comment.controller;

import com.codesquad_team01.issue_tracker.auth.Login;
import com.codesquad_team01.issue_tracker.comment.domain.Comment;
import com.codesquad_team01.issue_tracker.comment.dto.request.CommentRequest;
import com.codesquad_team01.issue_tracker.comment.dto.response.CommentResponse;
import com.codesquad_team01.issue_tracker.comment.service.CommentService;
import com.codesquad_team01.issue_tracker.global.dto.ApiResponse;
import com.codesquad_team01.issue_tracker.comment.dto.mapper.CommentDtoMapper;
import com.codesquad_team01.issue_tracker.issue.domain.Issue;
import com.codesquad_team01.issue_tracker.issue.repository.IssueRepository;
import com.codesquad_team01.issue_tracker.member.domain.Member;
import com.codesquad_team01.issue_tracker.member.dto.response.AuthorResponse;
import com.codesquad_team01.issue_tracker.member.repository.MemberRepository;
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
    private final MemberRepository memberRepository;
    private final IssueRepository issueRepository;

    @PostMapping("/api/issues/{issueId}/comments")
    public ApiResponse<CommentResponse> createComment(
            @Login Long memberId,
            @PathVariable @Positive(message = "올바르지 않은 이슈 ID입니다.") Long issueId,
            @RequestBody @Valid CommentRequest commentRequest) {

        Comment comment = commentService.createComment(issueId, commentRequest, memberId);

        Member member = memberRepository.findById(memberId).orElseThrow();
        Issue issue = issueRepository.findById(issueId).orElseThrow();
        AuthorResponse authorResponse = new AuthorResponse(member.getId(), member.getName());

        CommentResponse data = commentDtoMapper.toCommentResponse(
                comment.getId(),
                comment.getContents(),
                authorResponse,
                comment.getAuthorId().equals(issue.getAuthorId())
        );

        return ApiResponse.success("댓글 작성 완료", data);
    }

    @PatchMapping("/api/issues/{issueId}/comments/{commentId}")
    public ApiResponse<Void> updateComment(
            @Login Long memberId,
            @PathVariable @Positive(message = "올바르지 않은 이슈 ID입니다.") Long issueId,
            @PathVariable @Positive(message = "올바르지 않은 댓글 ID입니다.") Long commentId,
            @RequestBody @Valid CommentRequest commentRequest) {

        commentService.updateComment(issueId, commentId, commentRequest, memberId);

        return ApiResponse.success("댓글 수정 완료", null);
    }
}