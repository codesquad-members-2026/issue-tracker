package com.codesquad_team01.issue_tracker.issue.domain;

import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;


@Getter
public class Milestone {

    @Id
    private Long id;

    private String name;
    private LocalDate completionDate;
    private String description;
    private Boolean isOpened;

    private LocalDateTime deletedAt;

    public Milestone(Long id, String name, LocalDate completionDate,
                     String description, Boolean isOpened, LocalDateTime deletedAt) {
        this.id = id;
        this.name = name;
        this.completionDate = completionDate;
        this.description = description;
        this.isOpened = isOpened;
        this.deletedAt = deletedAt;
    }

}
