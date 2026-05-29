package com.codesquad_team01.issue_tracker.issue.dto.mapper;

import com.codesquad_team01.issue_tracker.issue.domain.Issue;
import com.codesquad_team01.issue_tracker.issue.dto.response.IssueResponse;
import com.codesquad_team01.issue_tracker.label.dto.mapper.LabelDtoMapper;
import com.codesquad_team01.issue_tracker.label.dto.response.LabelResponse;
import com.codesquad_team01.issue_tracker.member.dto.response.AuthorResponse;
import com.codesquad_team01.issue_tracker.member.dto.mapper.AuthorDtoMapper;
import com.codesquad_team01.issue_tracker.milestone.dto.response.MilestoneResponse;
import com.codesquad_team01.issue_tracker.milestone.dto.mapper.MilestoneDtoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class IssueDtoMapper {

    private final AuthorDtoMapper authorDtoMapper;
    private final MilestoneDtoMapper milestoneDtoMapper;
    private final LabelDtoMapper labelDtoMapper;


    public List<IssueResponse> toIssueResponses(List<Issue> issues) {

        if (issues.isEmpty()) {
            return List.of();
        }

        Map<Long, AuthorResponse> authorResponses = authorDtoMapper.getAuthorMap(issues);
        Map<Long, MilestoneResponse> milestoneResponses = milestoneDtoMapper.getMilestoneMap(issues);
        Map<Long, List<LabelResponse>> labelResponses = labelDtoMapper.getLabelMap(issues);


        List<IssueResponse> issueResponses = new ArrayList<>();
        for (Issue issue : issues) {
            issueResponses.add(new IssueResponse(
                    issue.getId(),
                    issue.getTitle(),
                    authorResponses.get(issue.getAuthorId()),
                    labelResponses.getOrDefault(issue.getId(), List.of()),
                    milestoneResponses.get(issue.getMilestoneId()),
                    issue.isOpened(),
                    issue.getCreatedAt()
            ));
        }
        return issueResponses;
    }
}
