package com.codesquad_team01.issue_tracker.comment.dto.mapper;

import com.codesquad_team01.issue_tracker.comment.domain.Comment;
import com.codesquad_team01.issue_tracker.comment.dto.response.CommentResponse;
import com.codesquad_team01.issue_tracker.issue.domain.Issue;
import com.codesquad_team01.issue_tracker.member.dto.response.AuthorResponse;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Component
public class CommentDtoMapper {

    public CommentResponse toCommentResponse(Long commentId, String contents) {
        AuthorResponse authorResponse = new AuthorResponse(1L, "완자");

        return new CommentResponse(
                commentId,
                authorResponse,
                contents,
                LocalDateTime.now(),
                true
        );
    }

    public List<CommentResponse> toCommentResponses(List<Comment> comments, Issue issue, Map<Long, AuthorResponse> memberMap) {
        return comments.stream()
                .map(comment -> new CommentResponse(
                        comment.getId(),
                        memberMap.get(comment.getAuthorId()),
                        comment.getContents(),
                        comment.getCreatedAt(),
                        comment.getAuthorId().equals(issue.getAuthorId())
                ))
                .toList();
    }
}