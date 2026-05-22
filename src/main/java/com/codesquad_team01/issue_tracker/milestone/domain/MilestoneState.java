package com.codesquad_team01.issue_tracker.milestone.domain;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum MilestoneState {
    OPEN(),
    CLOSED();

    @JsonCreator
    public static MilestoneState from(String value){
        if(value == null)
            return null;

        return MilestoneState.valueOf(value);
    }
}
