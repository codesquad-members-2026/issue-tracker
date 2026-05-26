package com.codesquad_team01.issue_tracker.issue.service;

import com.codesquad_team01.issue_tracker.issue.domain.Assignee;
import com.codesquad_team01.issue_tracker.issue.domain.Issue;
import com.codesquad_team01.issue_tracker.issue.domain.IssueLabel;
import com.codesquad_team01.issue_tracker.issue.dto.request.IssueWriteRequest;
import com.codesquad_team01.issue_tracker.issue.repository.IssueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IssueWriteService {

    private final IssueRepository issueRepository;

    @Transactional
    public Long writeIssue(IssueWriteRequest issueWriteRequest, List<MultipartFile> files) {

        Set<Assignee> assignees = issueWriteRequest.assigneeIds().stream()
                .map(memberId -> new Assignee(null, memberId))
                .collect(Collectors.toSet());

        Set<IssueLabel> issueLabels = issueWriteRequest.labelIds().stream()
                .map(labelId -> new IssueLabel(null, labelId))
                .collect(Collectors.toSet());

        Issue issue = new Issue(
                issueWriteRequest.title(),
                issueWriteRequest.contents(),
                issueWriteRequest.milestoneId(),
                1L, // TODO: 로그인 기능 구현 후 실제 사용자 ID로 변경
                assignees,
                issueLabels
        );

        Issue savedIssue = issueRepository.save(issue);
        return savedIssue.getId();
    }
}