package com.codesquad_team01.issue_tracker.milestone.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;

public record MilestoneListItemResponse (
        Long id,
        String name,

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yy. MM. dd")
        LocalDate completionDate, // TODO: 날짜 형식 yyyy. mm. dd 로 변경

        String description,
        Boolean isOpened,
        Integer openIssueNum,
        Integer closedIssueNum
) {
}
