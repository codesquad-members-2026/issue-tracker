package com.codesquad_team01.issue_tracker.issue.repository;

import com.codesquad_team01.issue_tracker.issue.domain.IssueLabel;
import org.springframework.data.repository.CrudRepository;

public interface IssueLabelRepository extends CrudRepository<IssueLabel, Long> {
}
