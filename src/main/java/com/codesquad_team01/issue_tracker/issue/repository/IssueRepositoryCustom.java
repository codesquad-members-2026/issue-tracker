package com.codesquad_team01.issue_tracker.issue.repository;

import com.codesquad_team01.issue_tracker.issue.domain.Issue;
import com.codesquad_team01.issue_tracker.issue.dto.request.IssueFilterRequest;

import java.util.List;

public interface IssueRepositoryCustom {
    List<Issue> findByFilterCondition(IssueFilterRequest issueFilterRequest);
}
