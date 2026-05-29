package com.codesquad_team01.issue_tracker.label.dto.response;

import java.util.List;

public record LabelPageResponse (
        LabelMetaData metadata,
        List<LabelListResponse> labels
){}
