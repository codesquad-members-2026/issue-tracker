package com.codesquad_team01.issue_tracker.auth.service;

import com.codesquad_team01.issue_tracker.auth.GithubOauthClient;
import com.codesquad_team01.issue_tracker.auth.dto.response.GithubProfile;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final GithubOauthClient githubOauthClient;

    public AuthService(GithubOauthClient githubOauthClient){
        this.githubOauthClient = githubOauthClient;
    }

    public String login(String code) {
        String accessToken = githubOauthClient.getAccessToken(code);
        GithubProfile profile = githubOauthClient.getUserProfile(accessToken);
        return profile.login() + "님 환영합니다! (ID: " + profile.oauthId() + ")";
    }
}
