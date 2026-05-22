package com.codesquad_team01.issue_tracker.milestone.dto.response;

import com.codesquad_team01.issue_tracker.milestone.domain.Milestone;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;

public record MilestoneWriteResponse (
        Long id,
        String name,

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yy. MM. dd")
        LocalDate completionDate,

        String description,
        boolean isOpened,
        Integer openIssueNum,
        Integer closedIssueNum
) {

    public static MilestoneWriteResponse from(Milestone milestone) {
        return new MilestoneWriteResponse(
                milestone.getId(),
                milestone.getName(),
                milestone.getCompletionDate(),
                milestone.getDescription(),
                milestone.getIsOpened(),
                0, 0);
    }
}
