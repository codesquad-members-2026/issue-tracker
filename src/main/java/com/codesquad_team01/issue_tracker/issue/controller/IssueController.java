package com.codesquad_team01.issue_tracker.issue.controller;

import com.codesquad_team01.issue_tracker.issue.dto.request.IssueContentsRequest;
import com.codesquad_team01.issue_tracker.issue.dto.request.IssueStatusRequest;
import com.codesquad_team01.issue_tracker.issue.dto.request.IssueTitleUpdateRequest;
import com.codesquad_team01.issue_tracker.issue.dto.request.IssueWriteRequest;
import com.codesquad_team01.issue_tracker.global.dto.ApiResponse;
import com.codesquad_team01.issue_tracker.issue.dto.response.IssueDetailResponse;
import com.codesquad_team01.issue_tracker.issue.dto.response.IssueListResponse;
import com.codesquad_team01.issue_tracker.issue.service.IssueDetailService;
import com.codesquad_team01.issue_tracker.issue.service.IssueService;
import com.codesquad_team01.issue_tracker.issue.service.IssueWriteService;
import com.codesquad_team01.issue_tracker.label.dto.request.LabelsChangeIssueRequest;
import com.codesquad_team01.issue_tracker.member.dto.request.IssueAssigneesUpdateRequest;
import com.codesquad_team01.issue_tracker.milestone.dto.request.MilestoneUpdateRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@Validated
public class IssueController {

    private final IssueService issueService;
    private final IssueWriteService issueWriteService;
    private final IssueDetailService issueDetailService;

    public IssueController(IssueService issueService, IssueWriteService issueWriteService,
                           IssueDetailService issueDetailService) {
        this.issueService = issueService;
        this.issueWriteService = issueWriteService;
        this.issueDetailService = issueDetailService;

    }

    @GetMapping("/api/issues")
    public ApiResponse<IssueListResponse> getIssueList(@RequestParam(defaultValue = "open") String status) {
        boolean isOpened = status.equals("open");

        IssueListResponse data = issueService.getIssueList(isOpened);
        return ApiResponse.success("이슈 페이지 로딩 성공", data);
    }

    @PostMapping(value = "/api/issues", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<Map<String, Long>> uploadIssue(
            @RequestPart("request") @Valid IssueWriteRequest issueWriteRequest,
            @RequestPart(value = "files", required = false) List<MultipartFile> files) {

        Long issueId = issueWriteService.writeIssue(issueWriteRequest,files);

        return ApiResponse.success("이슈 작성 완료",Map.of("issueId", issueId));
    }

    @GetMapping("/api/issues/{issueId}")
    public ApiResponse<IssueDetailResponse> getIssueDetail(@PathVariable @Positive Long issueId) {
        IssueDetailResponse data = issueDetailService.getIssueDetail(issueId);

        return ApiResponse.success("이슈 상세 페이지 로딩 성공", data);
    }

    @PatchMapping("/api/issues/{issueId}")
    public ApiResponse<Void> patchIssue(@PathVariable @Positive Long issueId,
                                        @RequestBody @Valid IssueStatusRequest issueStatusRequest) {

        issueService.patchIssue(issueId, issueStatusRequest.status());
        return ApiResponse.success("이슈 닫기 성공", null);
    }

    @DeleteMapping("/api/issues/{issueId}")
    public ApiResponse<Void> deleteIssue(@PathVariable @Positive Long issueId) {
        issueService.deleteIssue(issueId);

        return ApiResponse.success("이슈 삭제 성공", null);
    }


    @PatchMapping("/api/issues/{issueId}/title")
    public ApiResponse<Void> updateIssueTitle(
            @PathVariable @Positive Long issueId,
            @RequestBody @Valid IssueTitleUpdateRequest request) {

        issueService.titleChange(issueId, request.title());
        return ApiResponse.success("이슈 제목 수정 성공", null);
    }

    @PatchMapping("/api/issues/{issueId}/contents")
    public ApiResponse<Void> updateIssueContents(
            @PathVariable @Positive Long issueId,
            @RequestBody IssueContentsRequest issueContentsRequest) {

        issueService.contentChange(issueId, issueContentsRequest.contents());

        return ApiResponse.success("본문 내용 수정 성공", null);
    }

    @PatchMapping("/api/issues/{issueId}/milestone")
    public ApiResponse<Void> updateIssueMilestone(
            @PathVariable @Positive Long issueId,
            @RequestBody MilestoneUpdateRequest milestoneUpdateRequest) {

        issueService.milestoneUpdate(issueId,milestoneUpdateRequest.milestoneId());

        return ApiResponse.success("이슈 마일스톤 수정 완료", null);
    }

    @PatchMapping("/api/issues/{issueId}/labels")
    public ApiResponse<Void> updateIssueLabels(
            @PathVariable @Positive Long issueId,
            @RequestBody LabelsChangeIssueRequest request) {
        issueService.labelUpdate(issueId, request.labelIds());

        return ApiResponse.success("이슈 레이블 수정 완료", null);
    }

    @PatchMapping("/api/issues/{issueId}/assignees")
    public ApiResponse<Void> updateIssueAssignees(
            @PathVariable @Positive Long issueId,
            @RequestBody IssueAssigneesUpdateRequest request) {

        issueService.assigneeUpdate(issueId, request.assigneeIds());

        return ApiResponse.success("이슈 담당자 수정 완료", null);
    }
}