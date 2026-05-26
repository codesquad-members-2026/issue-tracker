package com.codesquad_team01.issue_tracker.milestone.service;
import com.codesquad_team01.issue_tracker.label.repository.LabelRepository;
import com.codesquad_team01.issue_tracker.milestone.domain.Milestone;
import com.codesquad_team01.issue_tracker.milestone.domain.MilestoneState;
import com.codesquad_team01.issue_tracker.milestone.dto.request.MilestoneSingleRequest;
import com.codesquad_team01.issue_tracker.milestone.dto.response.*;
import com.codesquad_team01.issue_tracker.milestone.repository.MilestoneRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class MilestoneService {
    private final MilestoneRepository milestoneRepository;
    private final LabelRepository labelRepository;

    public MilestoneService(MilestoneRepository milestoneRepository, LabelRepository labelRepository) {
        this.milestoneRepository = milestoneRepository;
        this.labelRepository = labelRepository;
    }

    public MilestoneListResponse findMilestones(MilestoneState state){
        List<MilestoneListItemResponse> milestoneListItemResponses = milestoneRepository.findAllByState(state);
        MilestoneMetaData milestoneMetaData = new MilestoneMetaData(
                labelRepository.countByDeletedAtIsNull(), milestoneRepository.countByDeletedAtIsNull());

        return new MilestoneListResponse(milestoneMetaData, milestoneListItemResponses);
    }

    public MilestoneSingleResponse findMilestone(Long milestoneId){
        return MilestoneSingleResponse
                .from(milestoneRepository.findById(milestoneId)
                .orElseThrow(IllegalStateException::new));
    }

    @Transactional
    public MilestoneWriteResponse createMilestone(MilestoneSingleRequest milestoneSingleRequest){
        Milestone addedMilestone = milestoneRepository.save(milestoneSingleRequest.toMilestone());
        return MilestoneWriteResponse.from(addedMilestone);
    }

    @Transactional
    public MilestoneListItemResponse updateMilestoneState(MilestoneState state, Long milestoneId){
        boolean isUpdated = milestoneRepository.updateMilestoneState(state, milestoneId);

        // TODO: 추후 404로 예외처리
        if(!isUpdated){
            throw new IllegalStateException("마일스톤이 이미 삭제됐거나 존재하지 않습니다.");
        }

        return milestoneRepository.findByIdWithCounts(milestoneId).orElseThrow(IllegalStateException::new);
    }

    @Transactional
    public MilestoneListItemResponse updateMilestone(Long milestoneId, MilestoneSingleRequest milestoneSingleRequest){
        Milestone milestone = milestoneSingleRequest.toMilestone();
        boolean isUpdated = milestoneRepository.updateMilestone(milestoneId, milestone);

        if(!isUpdated){
            throw new IllegalStateException("마일스톤이 존재하지 않거나 이미 삭제되었습니다.");
        }

        return milestoneRepository.findByIdWithCounts(milestoneId).orElseThrow(IllegalStateException::new);
    }

    @Transactional
    public MilestoneDeleteResponse deleteMilestone(Long milestoneId){
        boolean idDeleted = milestoneRepository.deleteMilestoneById(milestoneId);

        if(!idDeleted){
            throw new IllegalStateException("마일스톤이 이미 삭제됐거나 존재하지 않습니다."); // TODO: 추후 404로 예외처리
        }

        return MilestoneDeleteResponse.from(milestoneId);
    }
}