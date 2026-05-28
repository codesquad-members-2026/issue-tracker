package com.codesquad_team01.issue_tracker.comment.service;

import com.codesquad_team01.issue_tracker.attachment.repository.AttachmentRepository;
import com.codesquad_team01.issue_tracker.comment.domain.Comment;
import com.codesquad_team01.issue_tracker.comment.dto.request.CommentRequest;
import com.codesquad_team01.issue_tracker.comment.repository.CommentRepository;
import com.codesquad_team01.issue_tracker.issue.domain.Issue;
import com.codesquad_team01.issue_tracker.issue.repository.IssueRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CommentServiceTest {

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private IssueRepository issueRepository;

    @Mock
    private AttachmentRepository attachmentRepository;

    @InjectMocks
    private CommentService commentService;

    @Test
    @DisplayName("댓글 작성 시 유효한 이슈 ID가 주어지면 저장 후 댓글 객체를 반환한다.")
    void createCommentSuccess() {
        // given
        Long issueId = 1L;
        Long memberId = 1L;
        CommentRequest request = new CommentRequest("test comment", List.of());
        when(issueRepository.findActiveById(issueId)).thenReturn(Optional.of(mock(Issue.class)));
        
        Comment mockComment = new Comment(100L, issueId, memberId, "test comment", LocalDateTime.now(), null);
        when(commentRepository.save(any(Comment.class))).thenReturn(mockComment);

        // when
        Comment savedComment = commentService.createComment(issueId, request, memberId);

        // then
        assertThat(savedComment.getId()).isEqualTo(100L);
        assertThat(savedComment.getContents()).isEqualTo("test comment");
        assertThat(savedComment.getAuthorId()).isEqualTo(memberId);
    }
}
