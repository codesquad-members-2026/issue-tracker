package com.codesquad_team01.issue_tracker.label.dto.mapper;

import com.codesquad_team01.issue_tracker.issue.domain.Issue;
import com.codesquad_team01.issue_tracker.issue.domain.IssueLabel;
import com.codesquad_team01.issue_tracker.label.dto.response.LabelResponse;
import com.codesquad_team01.issue_tracker.label.repository.LabelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class LabelDtoMapper {

    private final LabelRepository labelRepository;

    public Map<Long, List<LabelResponse>> getLabelMap(List<Issue> issues) {
        List<Long> issueIds = new ArrayList<>();
        for (Issue issue : issues) {
            issueIds.add(issue.getId());
        }

        Map<Long, List<LabelResponse>> labelMap = new HashMap<>();
        for (LabelRepository.LabelWithIssueId row : labelRepository.findAllByIssueIdIn(issueIds)) {
            labelMap.computeIfAbsent(row.issueId(), k -> new ArrayList<>())
                    .add(new LabelResponse(row.id(), row.name(), row.backgroundColor(), row.textColor()));
        }
        return labelMap;
    }

    public List<LabelResponse> getLabelResponses(Issue issue) {
        List<LabelResponse> labels = new ArrayList<>();
        List<Long> labelIds = issue.getIssueLabels().stream().map(IssueLabel::getLabelId).toList();

        if (!labelIds.isEmpty()) {
            labelRepository.findAllById(labelIds).forEach(label ->
                    labels.add(new LabelResponse(label.getId(), label.getName(), label.getBackgroundColor(), label.getTextColor()))
            );
        }
        return labels;
    }
}