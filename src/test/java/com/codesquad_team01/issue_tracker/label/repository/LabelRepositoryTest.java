package com.codesquad_team01.issue_tracker.label.repository;

import com.codesquad_team01.issue_tracker.label.domain.Label;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.jdbc.DataJdbcTest;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJdbcTest
public class LabelRepositoryTest {

    @Autowired
    private LabelRepository labelRepository;

    // TODO: 정렬 테스트도 해야함
    @Test
    @DisplayName("Label 테이블 전체 데이터를 불러온다.")
    public void findAllTest(){
        Label label1 = labelRepository.save(new Label(null, "라벨1", "설명1",
                "#000000", "#111111", null));
        Label label2 = labelRepository.save(new Label(null, "라벨2", "설명2",
                "#000000", "#111111", null));
        Label label3 = labelRepository.save(new Label(null, "라벨3", "설명3",
                "#000000", "#111111", null));

        List<Label> labels = labelRepository.findAllLabelsNotDeleted();

        assertThat(labels).hasSize(3);

        assertThat(labels)
                .extracting(Label::getId)
                .containsExactlyInAnyOrder(label1.getId(), label2.getId(), label3.getId());

        assertThat(labels)
                .extracting(Label::getName)
                .containsExactlyInAnyOrder("라벨1", "라벨2", "라벨3");

        assertThat(labels)
                .extracting(Label::getDescription)
                .containsExactlyInAnyOrder("설명1", "설명2", "설명3");
    }

    @Test
    @DisplayName("Label 테이블 중 deleted_at이 null인 인스턴스만 불러온다.")
    public void findAllTest_only_deleted_at_null(){
        Label label1 = labelRepository.save(new Label(null, "라벨1", "설명1",
                "#000000", "#111111", null));
        Label label2 = labelRepository.save(new Label(null, "라벨2", "설명2",
                "#000000", "#111111", null));
        labelRepository.save(new Label(null, "라벨3", "설명3",
                "#000000", "#111111", LocalDateTime.now()));

        List<Label> labels = labelRepository.findAllLabelsNotDeleted();

        assertThat(labels).hasSize(2);

        assertThat(labels)
                .extracting(Label::getId)
                .containsExactlyInAnyOrder(label1.getId(), label2.getId());

        assertThat(labels)
                .extracting(Label::getName)
                .containsExactlyInAnyOrder(label1.getName(), label2.getName());

        assertThat(labels)
                .extracting(Label::getDescription)
                .containsExactlyInAnyOrder(label1.getDescription(), label2.getDescription());
    }
}