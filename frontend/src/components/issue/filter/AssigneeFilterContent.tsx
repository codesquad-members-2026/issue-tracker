// src/components/AssigneeFilterContent.tsx
import { type User } from '../../../types/Issue';

interface AssigneeFilterContentProps {
    members: User[];
    selectedAssignees: string[];
    onToggle: (username: string) => void;
}

export default function AssigneeFilterContent({ members, selectedAssignees, onToggle }: AssigneeFilterContentProps) {
    return (
        <div className="flex flex-col w-full bg-[#D9DBE9] gap-[1px] rounded-[16px] overflow-hidden shadow-[0_0_8px_0_rgba(20,20,43,0.04)]">

            {/* 팝업 타이틀 영역 */}
            <div className="w-full h-8 px-4 py-2 bg-[#F7F7FC] flex items-center">
                <span className="text-[12px] font-medium text-[#4E4B66]">담당자 필터</span>
            </div>

            {/* 담당자 옵션 리스트 */}
            <div className="flex flex-col gap-[1px]">
                {members.map((member) => {
                    const isSelected = selectedAssignees.includes(member.name);

                    return (
                        <button
                            key={member.id}
                            onClick={() => onToggle(member.name)}
                            className="w-full h-[44px] px-4 py-2 bg-[#FEFEFE] hover:bg-[#F7F7FC] flex items-center justify-between transition-colors cursor-pointer"
                        >
                            <div className="flex items-center gap-2">
                                <span className={`text-[16px] font-['Pretendard_Variable'] text-[#14142B] ${isSelected ? 'font-bold' : 'font-medium'}`}>
                                    {member.name}
                                </span>
                            </div>

                            {isSelected && (
                                <svg
                                    className="w-4 h-4 text-[#4E4B66]"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M5.33 8.33L7.33 10.33L10.67 6.67"
                                        stroke="currentColor"
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}