package com.codesquad_team01.issue_tracker.milestone.repository;

import com.codesquad_team01.issue_tracker.milestone.domain.Milestone;
import com.codesquad_team01.issue_tracker.milestone.domain.MilestoneState;
import com.codesquad_team01.issue_tracker.milestone.dto.response.MilestoneListItemResponse;
import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MilestoneRepository extends ListCrudRepository<Milestone, Long> {

    @Query("SELECT * FROM milestone WHERE name = :name " +
            "AND deleted_at is null")
    List<Milestone> findByName(String name);
    long countByDeletedAtIsNull();

    @Query("SELECT " +
            "m.id , " +
            "m.name,  " +
            "m.completion_date,  " +
            "m.description, " +
            "(SELECT COUNT(*) FROM issue i WHERE m.id = i.milestone_id AND i.is_opened = 1 AND i.deleted_at IS NULL) " +
            "AS open_issue_num, " +
            "(SELECT COUNT(*) FROM issue i WHERE i.milestone_id = m.id AND i.is_opened = 0 AND i.deleted_at IS NULL) " +
            "AS closed_issue_num " +
            "FROM milestone m " +
            "WHERE m.is_opened = :#{#state.name() == 'OPEN' ? 1 : 0} AND m.deleted_at IS NULL " +
            "ORDER BY m.id DESC")
    List<MilestoneListItemResponse> findAllByState(@Param("state") MilestoneState state);

    @Modifying
    @Query("UPDATE milestone SET deleted_at = NOW() WHERE id = :id AND deleted_at IS NULL")
    boolean deleteMilestoneById(@Param("id") Long id);
}
