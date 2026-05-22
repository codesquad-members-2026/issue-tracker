package com.codesquad_team01.issue_tracker.label.service;

import com.codesquad_team01.issue_tracker.label.domain.Label;
import com.codesquad_team01.issue_tracker.label.dto.request.LabelAddRequest;
import com.codesquad_team01.issue_tracker.label.dto.request.LabelUpdateRequest;
import com.codesquad_team01.issue_tracker.label.dto.response.LabelDeleteResponse;
import com.codesquad_team01.issue_tracker.label.dto.response.LabelDetailResponse;
import com.codesquad_team01.issue_tracker.label.dto.response.LabelPageResponse;
import com.codesquad_team01.issue_tracker.label.repository.LabelRepository;
import com.codesquad_team01.issue_tracker.milestone.repository.MilestoneRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class LabelServiceTest {
    @Mock
    private LabelRepository labelRepository;

    @Mock
    private MilestoneRepository milestoneRepository;

    @InjectMocks
    private LabelService labelService;

    @Test
    @DisplayName("LabelRepository, MilestoneRepository로 부터 넘겨받은" +
            "레이블 엔티티의 리스트 그리고 마일스톤 엔티티의 전체 개수를 LabelPageResponse 객체로 조립하여 반환한다.")
    public void getLabelsTest(){
        List<Label> dummyLabels = List.of(
            new Label(1L, "레이블1", "설명1", "#000000", "#111111", null),
                new Label(2L, "레이블2", "설명2", "#000000", "#111111", null)
        );
        long dummyMilestoneCount = 2L; // TODO: 추후 삭제된 마일스톤은 포함하지 않는 쿼리를 보냈고 그 결과를 받은 거이어야 함

        given(labelRepository.findAllLabelsNotDeleted()).willReturn(dummyLabels);
        given(milestoneRepository.count()).willReturn(dummyMilestoneCount);

        LabelPageResponse labelPageResponse = labelService.getLabels();

        assertThat(labelPageResponse.metadata().labelCount()).isEqualTo(dummyLabels.size());
        assertThat(labelPageResponse.metadata().milestoneCount()).isEqualTo(dummyMilestoneCount);
        assertThat(labelPageResponse.labels().getFirst().name()).isEqualTo("레이블1");
        assertThat(labelPageResponse.labels().get(1).name()).isEqualTo("레이블2");
    }

    @Test
    @DisplayName("삽입할 레이블 정보를 DTO로 전달하면, 서비스는 엔티티 변환 및 저장 후 LabelAddResponse DTO를 반환한다.")
    public void addLabelTest(){
        LabelAddRequest requestDto
                = new LabelAddRequest("bug", "버그 발생", "#000000", "#111111");

        Label savedEntity
                = new Label(4L, "bug", "버그 발생", "#000000",
                "#111111", null);

        given(labelRepository.save(any(Label.class))).willReturn(savedEntity);

        LabelDetailResponse responseDto = labelService.addLabel(requestDto);

        assertThat(responseDto.id()).isEqualTo(4L);
        assertThat(responseDto.name()).isEqualTo("bug");
        assertThat(responseDto.description()).isEqualTo("버그 발생");
    }

    @Test
    @DisplayName("존재하는 레이블의 id 값을 파라미터로 받으면, 해당 id의 Label 객체를 LabelDetailResponse로 변환하여 반환한다.")
    public void findLabelTest(){
        Label mockLabel
                = new Label(4L, "bug", "버그 발생", "#000000", "#111111", null);

        given(labelRepository.findLabelNotDeleted(any(Long.class))).willReturn(Optional.of(mockLabel));

        LabelDetailResponse responseDto = labelService.findLabel(4L);

        assertThat(responseDto.id()).isEqualTo(4L);
        assertThat(responseDto.name()).isEqualTo("bug");
        assertThat(responseDto.description()).isEqualTo("버그 발생");
        assertThat(responseDto.textColor()).isEqualTo("#000000");
        assertThat(responseDto.backgroundColor()).isEqualTo("#111111");
    }

//    @Test
//    @DisplayName("존재하지 않는 레이블의 id 값을 파라미터로 받으면 IllegalArgumentException 예외가 발생한다.")
//    public void findLabelTest_fail(){
//        Long notExistId = 999L;
//
//        given(labelRepository.findById(notExistId)).willReturn(Optional.empty());
//
//        assertThatThrownBy(() -> labelService.findLabel(notExistId))
//                // TODO: 추후 글로벌 예외 처리 도입 시, 공통 예외 및 에러 메세지 규격으로 교체
//                .isInstanceOf(IllegalArgumentException.class)
//                .hasMessageContaining("존재하지 않는 레이블입니다.");
//    }

    @Test
    @DisplayName("PATCH /api/labels/{labelId} : 일부 필드만 수정 요청이 오면, 나머지 필드는 기존 값을 유지하며 업데이트된다.")
    public void updateLabelTest() {
        // given: DB에 저장되어 있던 기존 라벨 상태
        Long targetId = 2L;
        Label existingLabel = new Label(targetId, "feat", "새로운 기능 추가", "#000000",
                "#00FF00", null);
        given(labelRepository.findLabelNotDeleted(targetId)).willReturn(Optional.of(existingLabel));

        // 수정 요청: 이름만 "bug"로 변경, 나머지는 안 보냄 (null)
        LabelUpdateRequest requestDto = new LabelUpdateRequest("bug", null, null, null);
        
        // save() 호출 시, 병합된 새 객체를 반환하도록 설정
        // save()의 파라미터로 들어간 Label 객체를 반환
        given(labelRepository.save(any(Label.class))).willAnswer(invocation -> invocation.getArgument(0));

        // when: 서비스의 업데이트 메서드 실행
        LabelDetailResponse response = labelService.updateLabel(targetId, requestDto);

        // then: 이름은 바뀌었고, 나머지는 기존 값을 유지해야 한다.
        assertThat(response.id()).isEqualTo(2L);
        assertThat(response.name()).isEqualTo("bug"); // 변경됨
        assertThat(response.description()).isEqualTo("새로운 기능 추가"); // 유지됨
        assertThat(response.textColor()).isEqualTo("#000000"); // 유지됨
        assertThat(response.backgroundColor()).isEqualTo("#00FF00"); // 유지됨
    }

    @Test
    @DisplayName("DELETE /api/labels/{labelId} : labelId에 해당하는 Label 값이 DB에 존재하면, deletedAt에 값을 넣어주고(현재 시간)" +
            "save()를 통해 DB를 최신화한다.")

    public void deleteLabelTest() {
        Long targetId = 2L;
        Label existingLabel = new Label(targetId, "feat", "새로운 기능 추가", "#000000",
                "#00FF00", null);
        given(labelRepository.findById(targetId)).willReturn(Optional.of(existingLabel));
        given(labelRepository.save(any(Label.class))).willAnswer(invocation -> invocation.getArgument(0));

        LabelDeleteResponse response = labelService.deleteLabel(targetId);

        assertThat(response.deletedId()).isEqualTo(targetId);

        ArgumentCaptor<Label> labelCaptor = ArgumentCaptor.forClass(Label.class);
        verify(labelRepository).save(labelCaptor.capture());

        Label capturedLabel = labelCaptor.getValue();
        assertThat(capturedLabel.getDeletedAt()).isNotNull();
    }
}