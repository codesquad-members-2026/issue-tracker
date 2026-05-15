package com.codesquad_team01.issue_tracker.issue.repository;

import com.codesquad_team01.issue_tracker.issue.domain.Milestone;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface MilestoneRepository extends CrudRepository<Milestone, Long> {

    @Query("SELECT * FROM milestone WHERE name = :name " +
            "AND deleted_at is null")
    List<Milestone> findByName(String name);
    long countByDeletedAtIsNull();
}
