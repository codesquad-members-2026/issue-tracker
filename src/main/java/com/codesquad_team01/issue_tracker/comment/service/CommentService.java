package com.codesquad_team01.issue_tracker.comment.service;

import com.codesquad_team01.issue_tracker.attachment.domain.Attachment;
import com.codesquad_team01.issue_tracker.attachment.repository.AttachmentRepository;
import com.codesquad_team01.issue_tracker.comment.domain.Comment;
import com.codesquad_team01.issue_tracker.comment.dto.request.CommentRequest;
import com.codesquad_team01.issue_tracker.comment.repository.CommentRepository;
import com.codesquad_team01.issue_tracker.global.exception.ErrorCode;
import com.codesquad_team01.issue_tracker.global.exception.IssueTrackerException;
import com.codesquad_team01.issue_tracker.issue.repository.IssueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final IssueRepository issueRepository;
    private final AttachmentRepository attachmentRepository;

    @Transactional
    public Long createComment(Long issueId, CommentRequest commentRequest) {

        issueRepository.findActiveById(issueId)
                .orElseThrow(() -> new IssueTrackerException(ErrorCode.CAN_NOT_FOUND_THE_PAGE));

        Comment comment = new Comment(
                null,
                issueId,
                1L, //TODO : 고정값 변경하기
                commentRequest.contents(),
                LocalDateTime.now(),
                null
        );

        Comment savedComment = commentRepository.save(comment);
        Long newCommentId = savedComment.getId();

        List<Long> attachmentIds = commentRequest.attachmentIds();
        if (attachmentIds != null && !attachmentIds.isEmpty()) {
            List<Attachment> attachments = attachmentRepository.findAllById(attachmentIds);
            for (Attachment attachment : attachments) {
                attachment.assignCommentId(newCommentId);
            }
            attachmentRepository.saveAll(attachments);
        }

        return newCommentId;
    }

    @Transactional
    public void updateComment(Long issueId, Long commentId, CommentRequest commentRequest) {

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IssueTrackerException(ErrorCode.CAN_NOT_FOUND_THE_PAGE));

        if (!comment.isSameIssue(issueId)) {
            throw new IssueTrackerException(ErrorCode.INVALID_QUERY_MESSAGE);
        }

        //TODO: 1L 인 부분 나중에 로그인 하면 받아오기
        if (!comment.isAuthor(1L)) {
            throw new IssueTrackerException(ErrorCode.INVALID_QUERY_MESSAGE);
        }

        comment.changeContents(commentRequest.contents());
        commentRepository.save(comment);
    }
}
