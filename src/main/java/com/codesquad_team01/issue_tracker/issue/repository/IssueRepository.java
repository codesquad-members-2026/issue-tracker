package com.codesquad_team01.issue_tracker.issue.repository;

import com.codesquad_team01.issue_tracker.global.exception.ErrorCode;
import com.codesquad_team01.issue_tracker.global.exception.IssueTrackerException;
import com.codesquad_team01.issue_tracker.issue.domain.Issue;
import org.springframework.data.jdbc.repository.query.Query; // 💡 @Query 임포트 확인!
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface IssueRepository extends ListCrudRepository<Issue, Long> {

    @Query("SELECT * FROM issue WHERE id = :id AND deleted_at IS NULL")
    Optional<Issue> findActiveById(@Param("id") Long id);

    @Query("SELECT * FROM issue WHERE is_opened = :isOpened AND deleted_at IS NULL ORDER BY created_at DESC")
    List<Issue> findList(@Param("isOpened") boolean isOpened);

    @Query("SELECT COUNT(*) FROM issue WHERE is_opened = :isOpened AND deleted_at IS NULL")
    long countByStatus(@Param("isOpened") boolean isOpened);

    @Query("SELECT COUNT(*) FROM issue WHERE milestone_id = :milestoneId AND deleted_at IS NULL")
    int countByMilestoneId(@Param("milestoneId") Long milestoneId);

    @Query("SELECT COUNT(*) FROM issue WHERE milestone_id = :milestoneId AND is_opened = :isOpened AND deleted_at IS NULL")
    int countByMilestoneIdAndStatus(@Param("milestoneId") Long milestoneId, @Param("isOpened") boolean isOpened);

    default Issue getOrThrow(Long issueId) {
        return findActiveById(issueId)
                .orElseThrow(() -> new IssueTrackerException(ErrorCode.CAN_NOT_FOUND_THE_PAGE));
    }
}