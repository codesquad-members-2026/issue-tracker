// src/components/AssigneeFilterContent.tsx
import { useState } from 'react';

// 테스트용 더미 데이터
const mockAssignees = [
    { id: 1, username: 'samsamis9', profileUrl: 'https://avatars.githubusercontent.com/samsamis9' },
    { id: 2, username: 'LeeJaeWan', profileUrl: 'https://avatars.githubusercontent.com/LeeJaeWan' },
    { id: 3, username: 'Wonjae-Song0906', profileUrl: 'https://avatars.githubusercontent.com/Wonjae-Song0906' },
    { id: 4, username: 'SSongWJ00', profileUrl: 'https://avatars.githubusercontent.com/SSongWJ00' },
];

export default function AssigneeFilterContent() {
    // 1. 단일 선택 상태 관리 (오직 한 명의 닉네임만 저장, null이면 아무도 선택되지 않음)
    const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null);

    return (
        // 2. Fragment 대신 독립적인 div 래퍼 사용
        // 부모에 의존하지 않고 스스로 둥근 모서리와 1px 간격 구분선을 처리하도록 설계
        <div className="flex flex-col w-full bg-[#D9DBE9] gap-[1px] rounded-[16px] overflow-hidden shadow-[0_0_8px_0_rgba(20,20,43,0.04)]">

            {/* 팝업 타이틀 영역 */}
            <div className="w-full h-8 px-4 py-2 bg-[#F7F7FC] flex items-center">
                <span className="text-[12px] font-medium text-[#4E4B66]">담당자 필터</span>
            </div>

            {/* 담당자 옵션 리스트 */}
            <div className="flex flex-col gap-[1px]">
                {mockAssignees.map((assignee) => {
                    const isSelected = selectedAssignee === assignee.username;

                    return (
                        <button
                            key={assignee.id}
                            onClick={() => {
                                // 3. 단일 선택 토글 로직: 이미 선택된 사람을 누르면 해제(null), 아니면 해당 사람 선택
                                setSelectedAssignee(isSelected ? null : assignee.username);
                            }}
                            className="w-full h-[44px] px-4 py-2 bg-[#FEFEFE] hover:bg-[#F7F7FC] flex items-center justify-between transition-colors cursor-pointer"
                        >
                            <div className="flex items-center gap-2">
                                <img
                                    src={`${assignee.profileUrl}?s=40&v=4`}
                                    alt={assignee.username}
                                    className="w-5 h-5 rounded-full border border-slate-200 object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
                                    }}
                                />
                                <span className={`text-[16px] font-['Pretendard_Variable'] text-[#14142B] ${isSelected ? 'font-bold' : 'font-medium'}`}>
                                    {assignee.username}
                                </span>
                            </div>

                            <svg
                                className="w-4 h-4 text-[#4E4B66]"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <circle cx="8" cy="8" r="7.2" stroke="currentColor" strokeWidth="1.6"/>
                                {isSelected && (
                                    <path
                                        d="M5.33 8.33L7.33 10.33L10.67 6.67"
                                        stroke="currentColor"
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                )}
                            </svg>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}