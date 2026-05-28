package com.codesquad_team01.issue_tracker.issue.repository;

import com.codesquad_team01.issue_tracker.issue.domain.Issue;
import com.codesquad_team01.issue_tracker.issue.dto.request.IssueFilterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.DataClassRowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class IssueRepositoryCustomImpl implements IssueRepositoryCustom {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    @Override
    public List<Long> findByFilterCondition(IssueFilterRequest condition) {
        StringBuilder sql = new StringBuilder(
                "SELECT i.id FROM issue i WHERE i.deleted_at IS NULL ");
        MapSqlParameterSource params = new MapSqlParameterSource();

        if (condition.isOpened() != null) {
            sql.append("AND i.is_opened = :isOpened ");
            params.addValue("isOpened", condition.isOpened());
        }
        if (condition.authorId() != null) {
            sql.append("AND i.author_id = :authorId ");
            params.addValue("authorId", condition.authorId());
        }
        if (condition.milestoneId() != null) {
            sql.append("AND i.milestone_id = :milestoneId ");
            params.addValue("milestoneId", condition.milestoneId());
        }
        if (condition.assigneeIds() != null && !condition.assigneeIds().isEmpty()) {
            sql.append("AND (SELECT COUNT(DISTINCT a2.member_id) FROM assignee a2 ")
                    .append("WHERE a2.issue_id = i.id AND " +
                            "a2.member_id IN (:assigneeIds)) = :assigneeCount ");
            params.addValue("assigneeIds", condition.assigneeIds());
            params.addValue("assigneeCount", condition.assigneeIds().size());
        }

        if (condition.commentAuthorId() != null) {
            sql.append("AND EXISTS (SELECT 1 FROM comment c ").append("WHERE c.issue_id = i.id AND " +
                    "c.author_id = :commentAuthorId AND c.deleted_at IS NULL) ");
            params.addValue("commentAuthorId", condition.commentAuthorId());

        }
        if (condition.labelIds() != null && !condition.labelIds().isEmpty()) {
            sql.append("AND (SELECT COUNT(DISTINCT il2.label_id) FROM issue_label il2 ")
                    .append("WHERE il2.issue_id = i.id AND " +
                            "il2.label_id IN (:labelIds)) = :labelCount ");
            params.addValue("labelIds", condition.labelIds());
            params.addValue("labelCount", condition.labelIds().size());
        }
        sql.append("ORDER BY i.created_at DESC");

        return jdbcTemplate.queryForList(sql.toString(), params, Long.class);
    }
}