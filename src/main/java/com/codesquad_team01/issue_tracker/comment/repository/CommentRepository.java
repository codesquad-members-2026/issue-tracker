package com.codesquad_team01.issue_tracker.comment.repository;

import com.codesquad_team01.issue_tracker.comment.domain.Comment;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentRepository extends CrudRepository<Comment, Long> {

    @Query("SELECT * FROM comment WHERE issue_id = :issueId AND deleted_at IS NULL ORDER BY id ASC")
    List<Comment> findActiveByIssueId(@Param("issueId") Long issueId);
}
