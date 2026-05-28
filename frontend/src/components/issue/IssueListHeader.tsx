// src/components/IssueListHeader.tsx
import ListFilterDropdown from "./ListFilterDropdown.tsx";
import AssigneeFilterContent from "./filter/AssigneeFilterContent.tsx";
import { type User, type Label, type Milestone } from "../../types/Issue";
import { type FilterTokens, buildFilterString } from "../../utils/filterParser";

interface IssueListHeaderProps {
    isAllSelected: boolean;
    onToggleAll: () => void;
    openCount: number;
    closedCount: number;
    currentStatus?: 'open' | 'closed';
    onStatusChange: (status: 'open' | 'closed') => void;
    metadata: {
        members: User[];
        labels: Label[];
        milestones: Milestone[];
    };
    tokens: FilterTokens;
    onFilterChange: (newQ: string) => void;
}

export default function IssueListHeader({
                                            isAllSelected,
                                            onToggleAll,
                                            openCount,
                                            closedCount,
                                            currentStatus,
                                            onStatusChange,
                                            metadata,
                                            tokens,
                                            onFilterChange
                                        }: IssueListHeaderProps) {

    const handleToggleAssignee = (username: string) => {
        const currentAssignees = tokens.assignee || [];
        const newAssignees = currentAssignees.includes(username)
            ? currentAssignees.filter(u => u !== username)
            : [...currentAssignees, username];

        onFilterChange(buildFilterString({ ...tokens, assignee: newAssignees }));
    };

    const handleToggleLabel = (labelName: string) => {
        const currentLabels = tokens.label || [];
        const newLabels = currentLabels.includes(labelName)
            ? currentLabels.filter(l => l !== labelName)
            : [...currentLabels, labelName];

        onFilterChange(buildFilterString({ ...tokens, label: newLabels }));
    };

    const handleToggleMilestone = (milestoneName: string) => {
        const newMilestone = tokens.milestone === milestoneName ? undefined : milestoneName;
        onFilterChange(buildFilterString({ ...tokens, milestone: newMilestone }));
    };

    const handleToggleAuthor = (username: string) => {
        const newAuthor = tokens.author === username ? undefined : username;
        onFilterChange(buildFilterString({ ...tokens, author: newAuthor }));
    };

    return (
        <div className="flex items-center w-full h-[64px] bg-[#F7F7FC] rounded-t-[16px] px-8 border-b border-slate-200 gap-6">
            <input
                type="checkbox"
                id="headerSelectAllCheckbox"
                checked={isAllSelected}
                onChange={onToggleAll}
                className="w-4 h-4 rounded-[2px] border-[1.6px] border-[#D9DBE9] text-blue-600 focus:ring-0 cursor-pointer"
            />

            <div className="flex items-center gap-6 ml-8">
                {/* [A] 열린 이슈 버튼 */}
                <button
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => onStatusChange('open')}
                >
                    <svg className={`w-4 h-4 ${currentStatus === 'open' ? 'text-[#14142B]' : 'text-[#4E4B66]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" strokeWidth="2"></circle>
                        <path d="M12 8v4m0 4h.01" strokeWidth="2" strokeLinecap="round"></path>
                    </svg>
                    <span className={`font-['Pretendard'] text-[16px] ${currentStatus === 'open' ? 'font-bold text-[#14142B]' : 'font-medium text-[#4E4B66]'}`}>
                        열린 이슈({openCount})
                    </span>
                </button>

                {/* [B] 닫힌 이슈 버튼 */}
                <button
                    className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => onStatusChange('closed')}
                >
                    <svg className={`w-4 h-4 ${currentStatus === 'closed' ? 'text-[#14142B]' : 'text-[#4E4B66]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                    </svg>
                    <span className={`font-['Pretendard'] text-[16px] ${currentStatus === 'closed' ? 'font-bold text-[#14142B]' : 'font-medium text-[#4E4B66]'}`}>
                        닫힌 이슈({closedCount})
                    </span>
                </button>
            </div>

            <div className="flex items-center gap-8 ml-auto">
                <ListFilterDropdown title="담당자">
                    <AssigneeFilterContent
                        members={metadata.members}
                        selectedAssignees={tokens.assignee || []}
                        onToggle={handleToggleAssignee}
                    />
                </ListFilterDropdown>

                <ListFilterDropdown title="레이블">
                     <div className="flex flex-col w-full bg-[#D9DBE9] gap-[1px] rounded-[16px] overflow-hidden shadow-[0_0_8px_0_rgba(20,20,43,0.04)]">
                        <div className="w-full h-8 px-4 py-2 bg-[#F7F7FC] flex items-center">
                            <span className="text-[12px] font-medium text-[#4E4B66]">레이블 필터</span>
                        </div>
                        <div className="flex flex-col gap-[1px]">
                            {metadata.labels.map((label) => {
                                const isSelected = tokens.label?.includes(label.name);
                                return (
                                    <button
                                        key={label.id}
                                        onClick={() => handleToggleLabel(label.name)}
                                        className="w-full h-[44px] px-4 py-2 bg-[#FEFEFE] hover:bg-[#F7F7FC] flex items-center justify-between transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: label.backgroundColor }} />
                                            <span className={`text-[16px] font-['Pretendard_Variable'] text-[#14142B] ${isSelected ? 'font-bold' : 'font-medium'}`}>
                                                {label.name}
                                            </span>
                                        </div>
                                        {isSelected && (
                                            <svg className="w-4 h-4 text-[#4E4B66]" viewBox="0 0 16 16" fill="none">
                                                <path d="M5.33 8.33L7.33 10.33L10.67 6.67" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </ListFilterDropdown>

                <ListFilterDropdown title="마일스톤">
                    <div className="flex flex-col w-full bg-[#D9DBE9] gap-[1px] rounded-[16px] overflow-hidden shadow-[0_0_8px_0_rgba(20,20,43,0.04)]">
                        <div className="w-full h-8 px-4 py-2 bg-[#F7F7FC] flex items-center">
                            <span className="text-[12px] font-medium text-[#4E4B66]">마일스톤 필터</span>
                        </div>
                        <div className="flex flex-col gap-[1px]">
                            {metadata.milestones.map((milestone) => {
                                const isSelected = tokens.milestone === milestone.name;
                                return (
                                    <button
                                        key={milestone.id}
                                        onClick={() => handleToggleMilestone(milestone.name)}
                                        className="w-full h-[44px] px-4 py-2 bg-[#FEFEFE] hover:bg-[#F7F7FC] flex items-center justify-between transition-colors cursor-pointer"
                                    >
                                        <span className={`text-[16px] font-['Pretendard_Variable'] text-[#14142B] ${isSelected ? 'font-bold' : 'font-medium'}`}>
                                            {milestone.name}
                                        </span>
                                        {isSelected && (
                                            <svg className="w-4 h-4 text-[#4E4B66]" viewBox="0 0 16 16" fill="none">
                                                <path d="M5.33 8.33L7.33 10.33L10.67 6.67" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </ListFilterDropdown>

                <ListFilterDropdown title="작성자">
                    <div className="flex flex-col w-full bg-[#D9DBE9] gap-[1px] rounded-[16px] overflow-hidden shadow-[0_0_8px_0_rgba(20,20,43,0.04)]">
                        <div className="w-full h-8 px-4 py-2 bg-[#F7F7FC] flex items-center">
                            <span className="text-[12px] font-medium text-[#4E4B66]">작성자 필터</span>
                        </div>
                        <div className="flex flex-col gap-[1px]">
                            {metadata.members.map((member) => {
                                const isSelected = tokens.author === member.name;
                                return (
                                    <button
                                        key={member.id}
                                        onClick={() => handleToggleAuthor(member.name)}
                                        className="w-full h-[44px] px-4 py-2 bg-[#FEFEFE] hover:bg-[#F7F7FC] flex items-center justify-between transition-colors cursor-pointer"
                                    >
                                        <span className={`text-[16px] font-['Pretendard_Variable'] text-[#14142B] ${isSelected ? 'font-bold' : 'font-medium'}`}>
                                            {member.name}
                                        </span>
                                        {isSelected && (
                                            <svg className="w-4 h-4 text-[#4E4B66]" viewBox="0 0 16 16" fill="none">
                                                <path d="M5.33 8.33L7.33 10.33L10.67 6.67" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </ListFilterDropdown>
            </div>
        </div>
    );
}