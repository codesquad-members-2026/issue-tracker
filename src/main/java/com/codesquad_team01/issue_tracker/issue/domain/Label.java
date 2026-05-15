package com.codesquad_team01.issue_tracker.issue.domain;

import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;

import java.time.LocalDateTime;

@Getter
public class Label {

    @Id
    private Long id;

    private String name;
    private String description;
    private String textColor;
    private String backgroundColor;
    private LocalDateTime deletedAt;

    public Label(Long id ,String name, String description, String textColor, String backgroundColor
    , LocalDateTime deletedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.textColor = textColor;
        this.backgroundColor = backgroundColor;
        this.deletedAt = deletedAt;
    }
}
