package com.codesquad_team01.issue_tracker.issue.service;

import com.codesquad_team01.issue_tracker.issue.domain.Issue;
import com.codesquad_team01.issue_tracker.issue.dto.response.*;
import com.codesquad_team01.issue_tracker.issue.repository.IssueRepository;
import com.codesquad_team01.issue_tracker.issue.repository.LabelRepository;
import com.codesquad_team01.issue_tracker.issue.repository.MemberRepository;
import com.codesquad_team01.issue_tracker.issue.repository.MilestoneRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IssueService {

    private final IssueRepository issueRepository;
    private final LabelRepository labelRepository;
    private final MemberRepository memberRepository;
    private final MilestoneRepository milestoneRepository;

    public IssueService(IssueRepository issueRepository, LabelRepository labelRepository,
                        MemberRepository memberRepository, MilestoneRepository milestoneRepository ) {
        this.issueRepository = issueRepository;
        this.labelRepository = labelRepository;
        this.memberRepository = memberRepository;
        this.milestoneRepository = milestoneRepository;
    }


    public IssueListResponse getIssueList(boolean isOpened) {
        List<Issue> issueList =  issueRepository.findAllByIsOpened(isOpened);

        List<IssueResponse> issues = issueList.stream()
                .map(this::convertToIssueResponse)
                .toList();

        long  openedIssueCount = issueRepository.countByIsOpenedAndDeletedAtIsNull(true);
        long closedIssueCount = issueRepository.countByIsOpenedAndDeletedAtIsNull(false);
        long labelCount = labelRepository.countByDeletedAtIsNull();
        long milestoneCount = milestoneRepository.countByDeletedAtIsNull();

        IssueListResponse.Metadata metadata = new IssueListResponse.Metadata(
                openedIssueCount,
                closedIssueCount,
                labelCount,
                milestoneCount
        );

        return new IssueListResponse(metadata, issues);
    }

    private IssueResponse convertToIssueResponse(Issue issue) {

        AuthorResponse author = memberRepository.findById(issue.getAuthorId())
                .map(member -> new AuthorResponse(member.getId(), member.getName()))
                .orElse(new AuthorResponse(null, "알 수 없는 사용자"));

        List<LabelResponse> label = labelRepository.findAllByIssueId(issue.getId())
                .stream().map(l -> new LabelResponse(l.getId(), l.getName(),
                        l.getBackgroundColor(), l.getTextColor()))
                .toList();

        MilestoneResponse milestone = null;
        if (issue.getMilestoneId() != null) {
            milestone = milestoneRepository.findById(issue.getMilestoneId())
                    .map(m -> new MilestoneResponse(m.getId(), m.getName()))
                    .orElse(null);
        }

        return new IssueResponse(
                issue.getId(),
                issue.getTitle(),
                author,
                label,
                milestone,
                issue.isOpened(),
                issue.getCreatedAt()
        );
    }
}
