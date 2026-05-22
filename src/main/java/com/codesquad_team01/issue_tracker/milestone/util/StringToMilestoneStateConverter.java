package com.codesquad_team01.issue_tracker.milestone.util;

import com.codesquad_team01.issue_tracker.milestone.domain.MilestoneState;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class StringToMilestoneStateConverter implements Converter<String, MilestoneState> {

    @Override
    public MilestoneState convert(String source) {
        return switch (source){
            case "OPEN" -> MilestoneState.OPEN;
            case "CLOSED" -> MilestoneState.CLOSED;
            default -> MilestoneState.OPEN;
        };
    }
}
