package com.codesquad_team01.issue_tracker.global.exception;

import lombok.Getter;

@Getter
public class IssueTrackerException extends RuntimeException {
    private final ErrorCode errorCode;

    public IssueTrackerException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}