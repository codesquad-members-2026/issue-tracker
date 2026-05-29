-- 1. member 데이터 (작성자 및 담당자)
INSERT INTO member (user_id, name, password, email) VALUES
                                                        ('wanja', '완자', 'password123', 'wanja@example.com'),
                                                        ('hana', '하나', 'password123', 'ssongwj00@example.com');

-- 2. milestone 데이터
INSERT INTO milestone (name, description, completion_date, is_opened) VALUES
                                                                          ('마일스톤 1', '첫 번째 목표입니다.', '2026-06-30', true),
                                                                          ('마일스톤 2', '두 번째 목표입니다.', '2026-12-31', true),
                                                                          ('마일스톤 3', '세 번째 목표입니다.', '2026-12-31', true);

-- 3. label 데이터
INSERT INTO label (name, description, background_color, text_color) VALUES
                                                                        ('bug', '버그 수정용 라벨', '#FF0000', '#FFFFFF'),
                                                                        ('feat', '새로운 기능 추가', '#00FF00', '#000000'),
                                                                        ('documentation', '문서 작업', '#0000FF', '#FFFFFF'),
                                                                        ('chore', '환경 설정', '#FF00FF', '#FFFFFF');

-- 4. issue 데이터 (메인 목록의 주인공)
INSERT INTO issue (title, contents, is_opened, author_id, milestone_id, created_at) VALUES
                                                                                       ('이슈 목록 기능을 구현해야 합니다.', '목록 페이지에서 여러 정보를 보여줍니다.', true, 1, 1, '2026-05-11 10:00:00'),
                                                                                       ('로그인 기능을 구현해야 합니다.', 'OAuth 2.0을 사용합니다.', true, 2, 1, '2026-05-11 11:00:00'),
                                                                                       ('삭제된 테스트 이슈', '이 이슈는 목록에 보이지 않아야 합니다.', false, 1, 2, '2026-05-10 09:00:00'),
                                                                                       ('닫힌 테스트 이슈', '이 이슈는 안녕하세요.', false, 1, 2, '2026-05-10 09:00:00');

-- 소프트 딜리트 테스트용 데이터 업데이트
UPDATE issue SET deleted_at = '2026-05-11 11:10:00' WHERE id = 3;

-- 5. assignee 데이터 (이슈 담당자 연결 - 전략 2 적용)
INSERT INTO assignee (issue_id, member_id) VALUES
                                               (1, 1), -- 이슈 1에 완자 배정
                                               (1, 2), -- 이슈 1에 하나 배정
                                               (2, 2); -- 이슈 2에 하나 배정

-- 6. issue_label 데이터 (이슈 라벨 연결 - 전략 2 적용)
INSERT INTO issue_label (issue_id, label_id) VALUES
                                                 (1, 1), -- 이슈 1에 bug 라벨
                                                 (1, 2), -- 이슈 1에 feat 라벨
                                                 (2, 2); -- 이슈 2에 feat 라벨

-- 7. comment 데이터
INSERT INTO comment (issue_id, author_id, contents, created_at) VALUES
                                                                    (1, 2, '이슈 목록 기능의 API 설계는 어떻게 할까요?', '2026-05-11 10:05:00'),
                                                                    (1, 1, 'REST API로 간단하게 구현하면 될 것 같아요.', '2026-05-11 10:10:00'),
                                                                    (2, 1, 'GitHub OAuth를 연동할까요?', '2026-05-11 11:05:00');