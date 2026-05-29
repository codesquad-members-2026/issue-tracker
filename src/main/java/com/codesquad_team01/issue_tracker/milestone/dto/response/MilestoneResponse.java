package com.codesquad_team01.issue_tracker.milestone.dto.response;

public class MilestoneResponse {

    private final Long id;
    private final String name;
    private final Integer progress;

    public MilestoneResponse(Long id, String name) {
        this.id = id;
        this.name = name;
        this.progress = null;
    }

    public MilestoneResponse(Long id, String name, Integer progress) {
        this.id = id;
        this.name = name;
        this.progress = progress;
    }


    public Long getId() {return id;}
    public String getName() {return name;}
    public Integer getProgress() {return progress;}
}
