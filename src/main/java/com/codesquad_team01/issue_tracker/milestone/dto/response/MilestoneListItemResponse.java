package com.codesquad_team01.issue_tracker.milestone.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;

public record MilestoneListItemResponse (
        Long id,
        String name,

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yy. MM. dd")
        LocalDate completionDate,

        String description,
        Boolean isOpened,
        Integer openIssueNum,
        Integer closedIssueNum
) {
}
