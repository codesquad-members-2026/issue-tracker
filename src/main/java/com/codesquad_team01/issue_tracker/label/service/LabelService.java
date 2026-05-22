package com.codesquad_team01.issue_tracker.label.service;

import com.codesquad_team01.issue_tracker.label.domain.Label;
import com.codesquad_team01.issue_tracker.label.dto.request.LabelAddRequest;
import com.codesquad_team01.issue_tracker.label.dto.request.LabelUpdateRequest;
import com.codesquad_team01.issue_tracker.label.dto.response.*;
import com.codesquad_team01.issue_tracker.label.repository.LabelRepository;
import com.codesquad_team01.issue_tracker.milestone.repository.MilestoneRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class LabelService {
    private final LabelRepository labelRepository;
    private final MilestoneRepository milestoneRepository;

    public LabelService(LabelRepository labelRepository, MilestoneRepository milestoneRepository) {
        this.labelRepository = labelRepository;
        this.milestoneRepository = milestoneRepository;
    }

    public LabelPageResponse getLabels(){
        List<Label> labels = labelRepository.findAllLabelsNotDeleted();
        long milestoneCount = milestoneRepository.count(); // TODO: 추후 삭제된 마일스톤 거르는 쿼리를 보내도록 변경

        LabelMetaData labelMetaData = new LabelMetaData(labels.size(), milestoneCount);
        List<LabelListResponse> labelListResponse = convertLabelsToDto(labels);

        return new LabelPageResponse(labelMetaData, labelListResponse);
    }
    private List<LabelListResponse> convertLabelsToDto(List<Label> labels){
        return labels.stream()
                .map(LabelListResponse::from)
                .toList();
    }

    public LabelDetailResponse addLabel(LabelAddRequest labelAddRequest){
        Label before = labelAddRequest.toLabel();
        Label after = labelRepository.save(before);
        return LabelDetailResponse.labelToResponse(after);
    }

    public LabelDetailResponse findLabel(Long id){
        // TODO: 임시 예외 발생 -> 추후 커스텀 예외로 변경(레이블이 존재하지 않음)
        Label result = labelRepository.findLabelNotDeleted(id).orElseThrow(IllegalArgumentException::new);
        return LabelDetailResponse.labelToResponse(result);
    }

    public LabelDetailResponse updateLabel(Long id, LabelUpdateRequest labelUpdateRequest){
        // 기존 라벨 불러오기
        Label before = labelRepository.findLabelNotDeleted(id).orElseThrow(IllegalArgumentException::new);
        Label after = labelUpdateRequest.toLabel(before);
        labelRepository.save(after);
        return LabelDetailResponse.labelToResponse(after);
    }

    public LabelDeleteResponse deleteLabel(Long id){
        Label LabelToBeDeleted = labelRepository.findById(id).orElseThrow(IllegalArgumentException::new);
        LabelToBeDeleted.deleteLabel();
        return LabelDeleteResponse.from(labelRepository.save(LabelToBeDeleted));
    }
}