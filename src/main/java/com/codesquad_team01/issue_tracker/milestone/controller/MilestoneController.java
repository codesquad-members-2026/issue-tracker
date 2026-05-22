package com.codesquad_team01.issue_tracker.milestone.controller;

import com.codesquad_team01.issue_tracker.global.dto.ApiResponse;
import com.codesquad_team01.issue_tracker.milestone.domain.MilestoneState;
import com.codesquad_team01.issue_tracker.milestone.dto.request.MilestoneWriteRequest;
import com.codesquad_team01.issue_tracker.milestone.dto.response.*;
import com.codesquad_team01.issue_tracker.milestone.service.MilestoneService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@Validated
@RequestMapping("/api/milestones")
public class MilestoneController {
    private final MilestoneService milestoneService;

    public MilestoneController(MilestoneService milestoneService) {
        this.milestoneService = milestoneService;
    }

    @GetMapping
    public ApiResponse<MilestoneListResponse> getMilestones(
            @RequestParam("state") MilestoneState state
    ) {
        String message = state == MilestoneState.OPEN ? "열린 모든 마일스톤 조회 성공" : "닫힌 모든 마일스톤 조회 성공";
        return ApiResponse.success(message, milestoneService.findMilestones(state));
    }

    @GetMapping("{milestoneId}")
    public ApiResponse<MilestoneSingleResponse> getMilestone(
            @PathVariable @Min(value = 1, message = "ID는 1 이상의 양수여야 합니다.") Long milestoneId
    ){
        return ApiResponse.success("단일 마일스톤 로딩", milestoneService.findMilestone(milestoneId));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<MilestoneWriteResponse> createMilestone(
            @Valid @RequestBody MilestoneWriteRequest milestoneWriteRequest
    ) {
        return ApiResponse.success("마일스톤 작성 성공", milestoneService.createMilestone(milestoneWriteRequest));
    }

    @PatchMapping("/{milestoneId}")
    public ApiResponse<MilestoneListItemResponse> updateMilestoneState(
            @RequestParam("state") MilestoneState state,
            @PathVariable @Min(value = 1, message = "ID는 1 이상의 양수여야 합니다.") Long milestoneId
    ){
        String message = state == MilestoneState.OPEN ? "열린 마일스톤으로 상태 변경" : "닫힌 마일스톤으로 상태 변경";
        return ApiResponse.success(message, milestoneService.updateMilestoneState(state, milestoneId));
    }

    @DeleteMapping("/{milestoneId}")
    public ApiResponse<MilestoneDeleteResponse> deleteMilestone (
            @PathVariable @Min(value = 1, message = "ID는 1 이상의 양수여야 합니다.") Long milestoneId
    ){
        return ApiResponse.success("마일스톤 삭제 성공", milestoneService.deleteMilestone(milestoneId));
    }
}