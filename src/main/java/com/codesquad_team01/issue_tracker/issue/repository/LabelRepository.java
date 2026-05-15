package com.codesquad_team01.issue_tracker.issue.repository;

import com.codesquad_team01.issue_tracker.issue.domain.Label;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface LabelRepository extends CrudRepository<Label, Long> {


    @Query("SELECT * FROM label WHERE name = :name " +
            "AND deleted_at IS NULL")
    List<Label> findByName(String name);

    @Query("SELECT l.* FROM label l " +
            "JOIN issue_label il ON l.id = il.label_id " +
            "WHERE il.issue_id = :issueId AND l.deleted_at IS NULL")
    List<Label> findAllByIssueId(Long issueId);

    long countByDeletedAtIsNull();
}
