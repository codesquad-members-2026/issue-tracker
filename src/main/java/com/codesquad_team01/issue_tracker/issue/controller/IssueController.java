package com.codesquad_team01.issue_tracker.issue.controller;

import com.codesquad_team01.issue_tracker.issue.dto.response.ApiResponse;
import com.codesquad_team01.issue_tracker.issue.dto.response.IssueListResponse;
import com.codesquad_team01.issue_tracker.issue.service.IssueService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class IssueController {

    private final IssueService issueService;

    public IssueController(IssueService issueService) {
        this.issueService = issueService;
    }

    @GetMapping("/api/issues")
    public ApiResponse<IssueListResponse> getIssueList(@RequestParam(defaultValue = "open") String status) {
        boolean isOpened = status.equals("open");

        IssueListResponse data = issueService.getIssueList(isOpened);
        return ApiResponse.success("이슈 페이지 로딩 성공", data);
    }
}