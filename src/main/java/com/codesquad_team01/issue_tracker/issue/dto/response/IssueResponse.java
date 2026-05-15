package com.codesquad_team01.issue_tracker.issue.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public class IssueResponse {

    private final Long id;
    private final String title;
    private final AuthorResponse author;
    private final List<LabelResponse> labels;
    private final MilestoneResponse milestone;
    private final boolean isOpened;
    private final LocalDateTime createdAt;

    public IssueResponse(Long id, String title, AuthorResponse author, List<LabelResponse> labels,
                         MilestoneResponse milestone, boolean isOpened,  LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.labels = labels;
        this.milestone = milestone;
        this.isOpened = isOpened;
        this.createdAt = createdAt;
    }

    public Long getId() {return id;}
    public String getTitle() {return title;}
    public AuthorResponse getAuthor() {return author;}
    public List<LabelResponse> getLabels() {return labels;}
    public MilestoneResponse getMilestone() {return milestone;}
    public boolean isOpened() {return isOpened;}
    public LocalDateTime getCreatedAt() {return createdAt;}


}
