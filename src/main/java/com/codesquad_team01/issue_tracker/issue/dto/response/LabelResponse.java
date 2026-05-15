package com.codesquad_team01.issue_tracker.issue.dto.response;

public class LabelResponse {

    private final Long id;
    private final String name;
    private final String backgroundColor;
    private final String textColor;


    public LabelResponse(Long id, String name, String backgroundColor, String textColor) {
        this.id = id;
        this.name = name;
        this.backgroundColor = backgroundColor;
        this.textColor = textColor;
    }

    public Long getId() {return id;}
    public String getName() {return name;}
    public String getBackgroundColor() {return backgroundColor;}
    public String getTextColor() {return textColor;}


}
