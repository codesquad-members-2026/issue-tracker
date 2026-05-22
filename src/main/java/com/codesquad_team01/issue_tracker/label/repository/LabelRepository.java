package com.codesquad_team01.issue_tracker.label.repository;

import com.codesquad_team01.issue_tracker.label.domain.Label;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LabelRepository extends ListCrudRepository<Label, Long> {


    @Query("SELECT * FROM label WHERE name = :name " +
            "AND deleted_at IS NULL")
    List<Label> findByName(String name);

    record LabelWithIssueId(Long issueId, Long id, String name, String backgroundColor, String textColor) {}

    @Query("SELECT il.issue_id, l.* FROM label l " +
            "JOIN issue_label il ON l.id = il.label_id " +
            "WHERE il.issue_id IN (:issueIds) AND l.deleted_at IS NULL")
    List<LabelWithIssueId> findAllByIssueIdIn(List<Long> issueIds);

    long countByDeletedAtIsNull();

    @Query("SELECT id, name, description, text_color, background_color " +
            "FROM label " +
            "WHERE deleted_at IS NULL " +
            "ORDER BY id DESC")
    List<Label> findAllLabelsNotDeleted();

    @Query("SELECT id, name, description, text_color, background_color " +
            "FROM label " +
            "WHERE id = :id AND deleted_at IS NULL")
    Optional<Label> findLabelNotDeleted(@Param("id") Long id);
}
