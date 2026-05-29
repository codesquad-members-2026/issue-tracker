package com.codesquad_team01.issue_tracker.issue.service;

import com.codesquad_team01.issue_tracker.comment.domain.Comment;
import com.codesquad_team01.issue_tracker.comment.repository.CommentRepository;
import com.codesquad_team01.issue_tracker.issue.domain.Issue;
import com.codesquad_team01.issue_tracker.issue.dto.mapper.IssueDetailDtoMapper;
import com.codesquad_team01.issue_tracker.issue.dto.response.IssueDetailResponse;
import com.codesquad_team01.issue_tracker.issue.repository.IssueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IssueDetailService {

    private final IssueRepository issueRepository;
    private final CommentRepository commentRepository;
    private final IssueDetailDtoMapper issueDetailDtoMapper;

    @Transactional(readOnly = true)
    public IssueDetailResponse getIssueDetail(Long issueId) {
        Issue issue = issueRepository.getOrThrow(issueId);

        List<Comment> comments = commentRepository.findActiveByIssueId(issue.getId());

        return issueDetailDtoMapper.toIssueDetailResponse(issue, comments);
    }
}