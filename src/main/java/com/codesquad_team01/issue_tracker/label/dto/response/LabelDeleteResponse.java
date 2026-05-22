package com.codesquad_team01.issue_tracker.label.dto.response;

import com.codesquad_team01.issue_tracker.label.domain.Label;

public record LabelDeleteResponse (
        Long deletedId
){

    public static LabelDeleteResponse from(Label label){
        return new LabelDeleteResponse(label.getId());
    }
}
