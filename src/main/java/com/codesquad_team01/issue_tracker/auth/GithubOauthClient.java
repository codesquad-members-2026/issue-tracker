package com.codesquad_team01.issue_tracker.auth;

import com.codesquad_team01.issue_tracker.auth.dto.request.GithubTokenRequest;
import com.codesquad_team01.issue_tracker.auth.dto.response.GithubTokenResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.client.RestClient;

import java.util.Optional;

public class GithubOauthClient {

    private final String clientId;
    private final String clientSecret;
    private final String redirectUri;
    private final RestClient restClient;

    public GithubOauthClient(
            @Value("${oauth.github.client-id}") String clientId,
            @Value("${oauth.github.client-secret}") String clientSecret,
            @Value("${oauth.github.redirect-uri}") String redirectUri
    ) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUri = redirectUri;
        this.restClient = RestClient.create();
    }

    public String getAccessToken(String code){
        return Optional.ofNullable(
                restClient.post()
                .uri("https://github.com/login/oauth/access_token")
                .header("Accept", "application/json")
                .body(new GithubTokenRequest(clientId, clientSecret, code, redirectUri))
                .retrieve()
                .onStatus(HttpStatusCode::isError, (request, res) -> {
                    throw new RuntimeException("GitHub Access Token 발급 실패");
                })
                .body(GithubTokenResponse.class)
        )
                .map(GithubTokenResponse::accessToken)
                .orElseThrow(() -> new RuntimeException("GitHub Access Token 발급 실패"));
    }
//
//    public GithubProfile getUserProfile(String accessToken){
//
//        return null;
//    }
}
