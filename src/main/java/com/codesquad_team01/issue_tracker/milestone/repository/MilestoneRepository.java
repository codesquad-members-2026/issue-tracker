package com.codesquad_team01.issue_tracker.milestone.repository;

import com.codesquad_team01.issue_tracker.milestone.domain.Milestone;
import com.codesquad_team01.issue_tracker.milestone.domain.MilestoneState;
import com.codesquad_team01.issue_tracker.milestone.dto.response.MilestoneListItemResponse;
import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MilestoneRepository extends ListCrudRepository<Milestone, Long> {

    @Query("SELECT COUNT(*) FROM milestone WHERE deleted_at IS NULL")
    long countByDeletedAtIsNull();

    @Query("SELECT " +
            "m.id , " +
            "m.name,  " +
            "m.completion_date,  " +
            "m.description, " +
            "m.is_opened, " +
            "(SELECT COUNT(*) FROM issue i WHERE m.id = i.milestone_id AND i.is_opened = 1 AND i.deleted_at IS NULL) " +
            "AS open_issue_num, " +
            "(SELECT COUNT(*) FROM issue i WHERE i.milestone_id = m.id AND i.is_opened = 0 AND i.deleted_at IS NULL) " +
            "AS closed_issue_num " +
            "FROM milestone m " +
            "WHERE m.is_opened = :#{#state.name() == 'OPEN' ? 1 : 0} AND m.deleted_at IS NULL " +
            "ORDER BY m.id DESC")
    List<MilestoneListItemResponse> findAllByState(@Param("state") MilestoneState state);

    @Query("SELECT " +
            "m.id, " +
            "m.name, " +
            "m.completion_date, " +
            "m.description, " +
            "m.is_opened, " +
            "(SELECT COUNT(*) FROM issue i WHERE i.milestone_id = m.id AND i.deleted_at IS NULL AND i.is_opened = 1) AS open_issue_num, " +
            "(SELECT COUNT(*) FROM issue i WHERE i.milestone_id = m.id AND i.deleted_at IS NULL AND i.is_opened = 0) AS closed_issue_num " +
            "FROM milestone m " +
            "WHERE m.deleted_at IS NULL " +
            "AND m.id = :id ")
    Optional<MilestoneListItemResponse> findByIdWithCounts(@Param("id") Long id);

    @Modifying
    @Query("UPDATE milestone SET is_opened = :#{#state.name() == 'OPEN' ? 1 : 0} WHERE id = :id AND deleted_at IS NULL")
    Boolean updateMilestoneState(@Param("state") MilestoneState state, @Param("id") Long id);

    @Modifying
    @Query("UPDATE milestone SET deleted_at = NOW() WHERE id = :id AND deleted_at IS NULL")
    boolean deleteMilestoneById(@Param("id") Long id);

    @Modifying
    @Query("UPDATE milestone " +
            "SET " +
            "name=:#{#milestone.name}, " +
            "completion_date=:#{#milestone.completionDate}, " +
            "description=:#{#milestone.description} " +
            "WHERE id=:id AND deleted_at IS NULL")
    boolean updateMilestone(@Param("id") Long id, @Param("milestone") Milestone milestone);
}
