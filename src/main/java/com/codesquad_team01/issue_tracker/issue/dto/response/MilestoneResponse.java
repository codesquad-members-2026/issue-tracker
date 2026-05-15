package com.codesquad_team01.issue_tracker.issue.dto.response;

public class MilestoneResponse {

    private final Long id;
    private final String name;

    public MilestoneResponse(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public Long getId() {return id;}
    public String getName() {return name;}
}
