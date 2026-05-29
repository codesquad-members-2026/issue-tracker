package com.codesquad_team01.issue_tracker.label.controller;

import com.codesquad_team01.issue_tracker.global.dto.ApiResponse;
import com.codesquad_team01.issue_tracker.label.dto.request.LabelAddRequest;
import com.codesquad_team01.issue_tracker.label.dto.request.LabelUpdateRequest;
import com.codesquad_team01.issue_tracker.label.dto.response.LabelDeleteResponse;
import com.codesquad_team01.issue_tracker.label.dto.response.LabelDetailResponse;
import com.codesquad_team01.issue_tracker.label.dto.response.LabelPageResponse;
import com.codesquad_team01.issue_tracker.label.service.LabelService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@Validated // TODO: @Min 중복 제거 코드 필요 -> api로 넘어오는 id는 모두 양수여야 하기 때문이다.
@RequestMapping("/api/labels")
public class LabelController {
    private final LabelService labelService;

    public LabelController(LabelService labelService) {
        this.labelService = labelService;
    }

    // TODO: 레이블 정렬(가장 최근 생긴 레이블이 위로 간다), 삭제된 인스턴스 고려
    @GetMapping
    public ApiResponse<LabelPageResponse> getLabels() {
        LabelPageResponse responseData = labelService.getLabels();
        return ApiResponse.success("레이블 페이지 로딩 성공", responseData);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<LabelDetailResponse> addLabel(@Valid @RequestBody LabelAddRequest labelAddRequest) {
        LabelDetailResponse responseData = labelService.addLabel(labelAddRequest);
        return ApiResponse.success("레이블 추가 성공", responseData);
    }

    @GetMapping("/{labelId}")
    public ApiResponse<LabelDetailResponse> getLabel(
            @PathVariable @Min(value = 1, message = "ID는 1 이상의 양수여야 합니다.") Long labelId){

        return ApiResponse.success("레이블 편집 불러오기 성공", labelService.findLabel(labelId));
    }

    @PatchMapping("/{labelId}")
    public ApiResponse<LabelDetailResponse> updateLabel(
            @PathVariable @Min(value = 1, message = "ID는 1 이상의 양수여야 합니다.") Long labelId,
            @Valid @RequestBody LabelUpdateRequest labelUpdateRequest){

        return ApiResponse.success("레이블 편집 성공", labelService.updateLabel(labelId, labelUpdateRequest));
    }

    @DeleteMapping("/{labelId}")
    public ApiResponse<LabelDeleteResponse> deleteLabel(
        @PathVariable @Min(value = 1, message = "ID는 1 이상의 양수여야 합니다.") Long labelId){

        return ApiResponse.success("레이블 삭제 성공", labelService.deleteLabel(labelId));
    }
}