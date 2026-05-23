import ListFilterDropdown from "./ListFilterDropdown.tsx";
import type { IssueDetail, User, Label, Milestone } from "../types/Issue";

interface IssueDetailSidebarProps {
    issue: IssueDetail;
    allMembers: User[];
    allLabels: Label[];
    allMilestones: Milestone[];
    onDelete: () => void;
    onAssigneesUpdate: (assigneeIds: number[]) => Promise<void>;
    onLabelsUpdate: (labelIds: number[]) => Promise<void>;
    onMilestoneUpdate: (milestoneId: number | null) => Promise<void>;
}

// 공통 체크 아이콘
const CheckIcon = ({ isSelected }: { isSelected: boolean }) => (
    <svg className="w-4 h-4 text-[#4E4B66]" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7.2" stroke="currentColor" strokeWidth="1.6"/>
        {isSelected && (
            <path d="M5.33 8.33L7.33 10.33L10.67 6.67" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        )}
    </svg>
);

export default function IssueDetailSidebar({
    issue,
    allMembers,
    allLabels,
    allMilestones,
    onDelete,
    onAssigneesUpdate,
    onLabelsUpdate,
    onMilestoneUpdate
}: IssueDetailSidebarProps) {
    const handleToggleAssignee = (memberId: number) => {
        const currentIds = issue.assignees.map(a => a.id);
        const newIds = currentIds.includes(memberId)
            ? currentIds.filter(id => id !== memberId)
            : [...currentIds, memberId];
        void onAssigneesUpdate(newIds);
    };

    const handleToggleLabel = (labelId: number) => {
        const currentIds = issue.labels.map(l => l.id);
        const newIds = currentIds.includes(labelId)
            ? currentIds.filter(id => id !== labelId)
            : [...currentIds, labelId];
        void onLabelsUpdate(newIds);
    };

    const handleToggleMilestone = (milestoneId: number) => {
        const newId = issue.milestone?.id === milestoneId ? null : milestoneId;
        void onMilestoneUpdate(newId);
    };

    return (
        <div className="w-80 flex flex-col gap-2">
            <aside className="flex flex-col h-fit bg-white border border-slate-200 rounded-xl shadow-sm">
                {/* Assignees */}
                <div className="p-6 border-b border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-bold text-slate-500">담당자</h3>
                        <ListFilterDropdown title={""}>
                            <div className="flex flex-col w-full bg-[#D9DBE9] gap-[1px] rounded-[16px] overflow-hidden shadow-lg">
                                <div className="px-4 py-2 bg-[#F7F7FC] text-[12px] font-medium text-[#4E4B66]">담당자 설정</div>
                                {allMembers.map(member => (
                                    <button
                                        key={member.id}
                                        onClick={() => handleToggleAssignee(member.id)}
                                        className="w-full h-[44px] px-4 py-2 bg-[#FEFEFE] hover:bg-[#F7F7FC] flex items-center justify-between transition-colors"
                                    >
                                        <span className={`text-[16px] text-[#14142B] ${issue.assignees.some(a => a.id === member.id) ? 'font-bold' : 'font-medium'}`}>{member.name}</span>
                                        <CheckIcon isSelected={issue.assignees.some(a => a.id === member.id)} />
                                    </button>
                                ))}
                            </div>
                        </ListFilterDropdown>
                    </div>
                    <div className="flex flex-col gap-2">
                        {issue.assignees.length === 0 ? (
                            <span className="text-sm text-slate-400">담당자 없음</span>
                        ) : (
                            issue.assignees.map(assignee => (
                                <div key={assignee.id} className="flex items-center gap-2">
                                    <img
                                        src={`https://avatars.githubusercontent.com/${assignee.name}?s=20&v=4`}
                                        alt={assignee.name}
                                        className="w-5 h-5 rounded-full border border-slate-200"
                                    />
                                    <span className="text-sm font-medium text-slate-700">{assignee.name}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Labels */}
                <div className="p-6 border-b border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-bold text-slate-500">레이블</h3>
                        <ListFilterDropdown title={""}>
                            <div className="flex flex-col w-full bg-[#D9DBE9] gap-[1px] rounded-[16px] overflow-hidden shadow-lg">
                                <div className="px-4 py-2 bg-[#F7F7FC] text-[12px] font-medium text-[#4E4B66]">레이블 설정</div>
                                {allLabels.map(label => (
                                    <button
                                        key={label.id}
                                        onClick={() => handleToggleLabel(label.id)}
                                        className="w-full h-[44px] px-4 py-2 bg-[#FEFEFE] hover:bg-[#F7F7FC] flex items-center justify-between transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{backgroundColor: label.backgroundColor}} />
                                            <span className={`text-[16px] text-[#14142B] ${issue.labels.some(l => l.id === label.id) ? 'font-bold' : 'font-medium'}`}>{label.name}</span>
                                        </div>
                                        <CheckIcon isSelected={issue.labels.some(l => l.id === label.id)} />
                                    </button>
                                ))}
                            </div>
                        </ListFilterDropdown>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {issue.labels.length === 0 ? (
                            <span className="text-sm text-slate-400">레이블 없음</span>
                        ) : (
                            issue.labels.map(label => (
                                <span
                                    key={label.id}
                                    className="px-3 py-1 rounded-full text-xs font-bold"
                                    style={{ backgroundColor: label.backgroundColor, color: label.textColor }}
                                >
                                    {label.name}
                                </span>
                            ))
                        )}
                    </div>
                </div>

                {/* Milestone */}
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-bold text-slate-500">마일스톤</h3>
                        <ListFilterDropdown title={""}>
                            <div className="flex flex-col w-full bg-[#D9DBE9] gap-[1px] rounded-[16px] overflow-hidden shadow-lg">
                                <div className="px-4 py-2 bg-[#F7F7FC] text-[12px] font-medium text-[#4E4B66]">마일스톤 설정</div>
                                {allMilestones.map(ms => (
                                    <button
                                        key={ms.id}
                                        onClick={() => handleToggleMilestone(ms.id)}
                                        className="w-full h-[44px] px-4 py-2 bg-[#FEFEFE] hover:bg-[#F7F7FC] flex items-center justify-between transition-colors"
                                    >
                                        <span className={`text-[16px] text-[#14142B] ${issue.milestone?.id === ms.id ? 'font-bold' : 'font-medium'}`}>{ms.name}</span>
                                        <CheckIcon isSelected={issue.milestone?.id === ms.id} />
                                    </button>
                                ))}
                            </div>
                        </ListFilterDropdown>
                    </div>
                    <div className="flex flex-col gap-2">
                        {issue.milestone ? (
                            <>
                                <div className="flex items-center gap-2 text-[#4E4B66]">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20v-6a2 2 0 012-2h4.5m0 0l-3-3m3 3l-3 3M9 8V4m0 4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2a2 2 0 002-2V8z"></path>
                                    </svg>
                                    <span className="text-sm font-medium">{issue.milestone.name}</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2 mt-1">
                                    <div
                                        className="bg-[#007AFF] h-2 rounded-full"
                                        style={{ width: `${issue.milestone.progress}%` }}
                                    />
                                </div>
                            </>
                        ) : (
                            <span className="text-sm text-slate-400">마일스톤 없음</span>
                        )}
                    </div>
                </div>
            </aside>

            {/* Separate Delete Action Button below the sidebar box */}
            <div className="flex justify-end pr-2">
                <button 
                    onClick={onDelete}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#FF3B30] hover:bg-red-50 rounded-lg transition-colors"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    이슈 삭제
                </button>
            </div>
        </div>
    );
}
