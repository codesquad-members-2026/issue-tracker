package com.codesquad_team01.issue_tracker.milestone.service;
import com.codesquad_team01.issue_tracker.milestone.domain.MilestoneState;
import com.codesquad_team01.issue_tracker.milestone.dto.response.MilestoneDeleteResponse;
import com.codesquad_team01.issue_tracker.milestone.dto.response.MilestoneListResponse;
import com.codesquad_team01.issue_tracker.milestone.repository.MilestoneRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class MilestoneService {
    private final MilestoneRepository milestoneRepository;

    public MilestoneService(MilestoneRepository milestoneRepository) {
        this.milestoneRepository = milestoneRepository;
    }

    public MilestoneListResponse findMilestones(MilestoneState state){
        return new MilestoneListResponse(milestoneRepository.findAllByState(state));
    }

    @Transactional
    public MilestoneDeleteResponse deleteMilestone(Long milestoneId){
        boolean idDeleted = milestoneRepository.deleteMilestoneById(milestoneId);

        if(!idDeleted){
            throw new IllegalStateException("마일스톤이 존재하지 않거나 이미 삭제됐습니다."); // TODO: 추후 404로 예외처리
        }

        return MilestoneDeleteResponse.from(milestoneId);
    }
}