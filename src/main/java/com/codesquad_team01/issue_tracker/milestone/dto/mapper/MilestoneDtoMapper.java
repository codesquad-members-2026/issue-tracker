package com.codesquad_team01.issue_tracker.milestone.dto.mapper;

import com.codesquad_team01.issue_tracker.issue.domain.Issue;
import com.codesquad_team01.issue_tracker.issue.repository.IssueRepository;
import com.codesquad_team01.issue_tracker.milestone.domain.Milestone;
import com.codesquad_team01.issue_tracker.milestone.dto.response.MilestoneResponse;
import com.codesquad_team01.issue_tracker.milestone.repository.MilestoneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class MilestoneDtoMapper {

    private final MilestoneRepository milestoneRepository;
    private final IssueRepository issueRepository; // 💡 컴파일 에러 해결을 위해 레포지토리 의존성 추가!

    public Map<Long, MilestoneResponse> getMilestoneMap(List<Issue> issues) {
        List<Long> milestoneIds = new ArrayList<>();
        for (Issue issue : issues) {
            if (issue.getMilestoneId() != null) {
                milestoneIds.add(issue.getMilestoneId());
            }
        }

        Map<Long, MilestoneResponse> milestoneMap = new HashMap<>();
        milestoneRepository.findAllById(milestoneIds).forEach(ms ->
                milestoneMap.put(ms.getId(), new MilestoneResponse(ms.getId(), ms.getName()))
        );
        return milestoneMap;
    }

    public MilestoneResponse getMilestoneResponse(Issue issue) {
        if (issue.getMilestoneId() == null) {
            return null;
        }

        Milestone milestone = milestoneRepository.findById(issue.getMilestoneId())
                .orElseThrow(() -> new IllegalArgumentException("Milestone not found!"));

        int totalCount = issueRepository.countByMilestoneId(issue.getMilestoneId());
        int closedIssueCount = issueRepository.countByMilestoneIdAndStatus(issue.getMilestoneId(), false);

        int progress = 0;
        if (totalCount > 0) {
            progress = (closedIssueCount * 100 / totalCount);
        }

        return new MilestoneResponse(milestone.getId(), milestone.getName(), progress);
    }
}