package com.codesquad_team01.issue_tracker.auth;

import com.codesquad_team01.issue_tracker.auth.dto.request.GithubTokenRequest;
import com.codesquad_team01.issue_tracker.auth.dto.response.GithubProfile;
import com.codesquad_team01.issue_tracker.auth.dto.response.GithubTokenResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Optional;

@Component
public class GithubOauthClient {

    private final String clientId;
    private final String clientSecret;
    private final String redirectUri;
    private final String tokenUrl;
    private final String userUrl;
    private final RestClient restClient;

    public GithubOauthClient(
            @Value("${oauth.github.client-id}") String clientId,
            @Value("${oauth.github.client-secret}") String clientSecret,
            @Value("${oauth.github.redirect-uri}") String redirectUri,
            @Value("${oauth.github.token-url}") String tokenUrl,
            @Value("${oauth.github.user-url}") String userUrl
    ) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUri = redirectUri;
        this.tokenUrl = tokenUrl;
        this.userUrl = userUrl;
        this.restClient = RestClient.create();
    }

    public String getAccessToken(String code){
        return Optional.ofNullable(
                restClient.post()
                .uri(tokenUrl)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
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

    public GithubProfile getUserProfile(String accessToken){

        return restClient.get()
                .uri(userUrl)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .retrieve()
                .onStatus(HttpStatusCode::isError, (request, response) -> {
                    throw new RuntimeException("GitHub 사용자 프로필 조회 실패");
                })
                .body(GithubProfile.class);
    }
}
