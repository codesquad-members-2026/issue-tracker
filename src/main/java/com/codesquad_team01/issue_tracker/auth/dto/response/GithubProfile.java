package com.codesquad_team01.issue_tracker.auth.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public record GithubProfile(
        @JsonProperty("id") Long oauthId,
        @JsonProperty("login") String login,
        @JsonProperty("name") String name,
        @JsonProperty("avatar_url") String avatarUrl
) {
}
