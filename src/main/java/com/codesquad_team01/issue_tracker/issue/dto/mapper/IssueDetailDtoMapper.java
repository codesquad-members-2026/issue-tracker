package com.codesquad_team01.issue_tracker.issue.dto.mapper;

import com.codesquad_team01.issue_tracker.comment.domain.Comment;
import com.codesquad_team01.issue_tracker.comment.dto.mapper.CommentDtoMapper;
import com.codesquad_team01.issue_tracker.comment.dto.response.CommentResponse;
import com.codesquad_team01.issue_tracker.issue.domain.Issue;
import com.codesquad_team01.issue_tracker.issue.dto.response.IssueDetailResponse;
import com.codesquad_team01.issue_tracker.label.dto.mapper.LabelDtoMapper;
import com.codesquad_team01.issue_tracker.label.dto.response.LabelResponse;
import com.codesquad_team01.issue_tracker.member.dto.response.AuthorResponse;
import com.codesquad_team01.issue_tracker.member.dto.mapper.AuthorDtoMapper;
import com.codesquad_team01.issue_tracker.milestone.dto.response.MilestoneResponse;
import com.codesquad_team01.issue_tracker.milestone.dto.mapper.MilestoneDtoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
@RequiredArgsConstructor
public class IssueDetailDtoMapper {

    private final AuthorDtoMapper authorDtoMapper;
    private final MilestoneDtoMapper milestoneDtoMapper;
    private final LabelDtoMapper labelDtoMapper;
    private final CommentDtoMapper commentDtoMapper;

    public IssueDetailResponse toIssueDetailResponse(Issue issue, List<Comment> comments) {

        Set<Long> allRelatedMemberIds = collectMemberIds(issue, comments);
        Map<Long, AuthorResponse> memberMap = authorDtoMapper.getAuthorMapByMemberIds(allRelatedMemberIds);

        List<AuthorResponse> assignees = authorDtoMapper.getAssignees(issue, memberMap);
        List<CommentResponse> commentResponses = commentDtoMapper.toCommentResponses(comments, issue, memberMap);
        List<LabelResponse> labels = labelDtoMapper.getLabelResponses(issue);
        MilestoneResponse milestoneResponse = milestoneDtoMapper.getMilestoneResponse(issue);

        long commentCount = comments.size();
        AuthorResponse issueAuthor = memberMap.get(issue.getAuthorId());

        return new IssueDetailResponse(
                issue.getId(),
                issue.getTitle(),
                issue.getContents(),
                issue.isOpened(),
                issue.getCreatedAt(),
                issueAuthor,
                commentCount,
                commentResponses,
                assignees,
                labels,
                milestoneResponse
        );
    }

    private Set<Long> collectMemberIds(Issue issue, List<Comment> comments) {
        Set<Long> memberIds = new HashSet<>();
        memberIds.add(issue.getAuthorId());
        comments.forEach(comment -> memberIds.add(comment.getAuthorId()));
        issue.getAssignees().forEach(assignee -> memberIds.add(assignee.getMemberId()));
        return memberIds;
    }
}