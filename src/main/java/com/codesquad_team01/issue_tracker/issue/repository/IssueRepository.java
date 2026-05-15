package com.codesquad_team01.issue_tracker.issue.repository;

import com.codesquad_team01.issue_tracker.issue.domain.Issue;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface IssueRepository extends CrudRepository<Issue, Long> {

    @Query("SELECT * FROM issue WHERE is_opened = :isOpened " +
            "AND deleted_at IS NULL ORDER BY created_at DESC")
    List<Issue> findAllByIsOpened(boolean isOpened);

    long countByIsOpenedAndDeletedAtIsNull(boolean isOpened);
}
