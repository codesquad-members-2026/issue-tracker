package com.codesquad_team01.issue_tracker.issue.service;

import com.codesquad_team01.issue_tracker.issue.domain.Issue;
import com.codesquad_team01.issue_tracker.issue.domain.IssueStatus;
import com.codesquad_team01.issue_tracker.issue.dto.mapper.IssueDtoMapper;
import com.codesquad_team01.issue_tracker.issue.dto.response.IssueListResponse;
import com.codesquad_team01.issue_tracker.issue.dto.response.IssueResponse;
import com.codesquad_team01.issue_tracker.issue.repository.IssueRepository;
import com.codesquad_team01.issue_tracker.label.domain.Label;
import com.codesquad_team01.issue_tracker.label.repository.LabelRepository;
import com.codesquad_team01.issue_tracker.milestone.repository.MilestoneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class IssueService {

    private final IssueRepository issueRepository;
    private final LabelRepository labelRepository;
    private final MilestoneRepository milestoneRepository;
    private final IssueDtoMapper issueDtoMapper;

    @Transactional
    public void deleteIssue(Long issueId) {
        Issue issue = issueRepository.getOrThrow(issueId);
        issue.delete();
        issueRepository.save(issue);
    }

    @Transactional
    public void patchIssue(Long issueId, IssueStatus status) {

        Issue issue = issueRepository.getOrThrow(issueId);
        boolean isOpened = (status == IssueStatus.OPEN);
        issue.changeStatus(isOpened);
        issueRepository.save(issue);
    }

    @Transactional
    public void titleChange(Long issueId, String title) {

        Issue issue = issueRepository.getOrThrow(issueId);
        issue.changeTitle(title);
        issueRepository.save(issue);
    }

    @Transactional
    public void contentChange(Long issueId, String content) {
        Issue issue = issueRepository.getOrThrow(issueId);
        issue.changeContents(content);
        issueRepository.save(issue);
    }

    @Transactional
    public void milestoneUpdate(Long issueId, Long milestoneId) {
        Issue issue = issueRepository.getOrThrow(issueId);
        issue.updateMilestoneId(milestoneId);
        issueRepository.save(issue);
    }

    @Transactional
    public void labelUpdate(Long issueId, List<Long> labelIds) {
        Issue issue = issueRepository.getOrThrow(issueId);
        issue.updateLabelIds(labelIds);
        issueRepository.save(issue);
    }

    @Transactional
    public void assigneeUpdate(Long issueId, List<Long> assigneeIds) {
        Issue issue = issueRepository.getOrThrow(issueId);
        issue.updateAssignees(assigneeIds);
        issueRepository.save(issue);
    }

    @Transactional(readOnly = true)
    public IssueListResponse getIssueList(boolean isOpened) {

        IssueListResponse.Metadata metadata = createMetadata();
        List<Issue> issues = issueRepository.findList(isOpened);

        if (issues.isEmpty()) {
            return new IssueListResponse(metadata, List.of());
        }

        List<IssueResponse> issueResponses = issueDtoMapper.toIssueResponses(issues);

        return new IssueListResponse(metadata, issueResponses);

    }

    private IssueListResponse.Metadata createMetadata() {
        long openIssueCount = issueRepository.countByStatus(true);
        long closedIssueCount = issueRepository.countByStatus(false);
        long labelCount = labelRepository.countByDeletedAtIsNull();
        long milestoneCount = milestoneRepository.countByDeletedAtIsNull();

        return new IssueListResponse.Metadata(
                openIssueCount, closedIssueCount, labelCount, milestoneCount
        );
    }

}