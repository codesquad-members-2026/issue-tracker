package com.codesquad_team01.issue_tracker.issue.domain;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.MappedCollection;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Issue {
    @Id
    private Long id;
    private String title;
    private String contents;
    private Long milestoneId;
    private Long authorId;
    private boolean isOpened;
    private LocalDateTime createdAt;
    private LocalDateTime deletedAt;

    @MappedCollection(idColumn = "issue_id")
    private Set<Assignee> assignees;

    @MappedCollection(idColumn = "issue_id")
    private Set<IssueLabel> issueLabels;

    public Issue(Long id, String title, String contents, Long milestoneId, Long authorId,
                 boolean isOpened, LocalDateTime createdAt, LocalDateTime deletedAt,
                 Set<Assignee> assignees, Set<IssueLabel> issueLabels) {
        this.id = id;
        this.title = title;
        this.contents = contents;
        this.milestoneId = milestoneId;
        this.authorId = authorId;
        this.isOpened = isOpened;
        this.createdAt = createdAt;
        this.deletedAt = deletedAt;
        this.assignees = assignees != null ? assignees : Collections.emptySet();
        this.issueLabels = issueLabels != null ? issueLabels : Collections.emptySet();
    }

    public Issue(String title, String contents, Long milestoneId, Long authorId,
                 Set<Assignee> assignees, Set<IssueLabel> issueLabels) {
        this(null, title, contents, milestoneId, authorId, true,
                LocalDateTime.now(), null, assignees, issueLabels);
    }

    public void delete() {
        this.deletedAt = LocalDateTime.now();
    }

    public void changeStatus(boolean isOpened) {
        this.isOpened = isOpened;
    }

    public void changeTitle(String title) {
        this.title = title;
    }

    public void changeContents(String contents) {
        this.contents = contents;
    }

    public void updateMilestoneId(Long milestoneId) {
        this.milestoneId = milestoneId;
    }

    public void updateLabelIds(List<Long> newLabelIds) {
        this.issueLabels.clear();
        if (newLabelIds != null) {
            Set<IssueLabel> updatedLabels = newLabelIds.stream()
                    .map(labelId -> new IssueLabel(null, labelId))
                    .collect(Collectors.toSet());
            this.issueLabels.addAll(updatedLabels);
        }
    }

    public void updateAssignees(List<Long> newAssigneeIds) {
        this.assignees.clear();
        if (newAssigneeIds != null) {
            Set<Assignee> updatedAssignees = newAssigneeIds.stream()
                    .map(memberId -> new Assignee(null, memberId))
                    .collect(Collectors.toSet());
            this.assignees.addAll(updatedAssignees);
        }
    }
}