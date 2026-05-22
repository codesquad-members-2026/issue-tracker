package com.codesquad_team01.issue_tracker.label.dto.request;

import java.util.List;

public record LabelsChangeIssueRequest(
        List<Long> labelIds
){
}
