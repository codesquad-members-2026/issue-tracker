package com.codesquad_team01.issue_tracker.milestone.dto.response;

public record MilestoneListItemResponse (
        Long id,
        String name,
        String completionDate, // TODO: 날짜 형식 yyyy. mm. dd 로 변경
        String description,
        Boolean isOpened,
        Integer openIssueNum,
        Integer closedIssueNum
) {
}
