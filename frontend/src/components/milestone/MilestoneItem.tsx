// src/components/milestone/MilestoneItem.tsx
import MilestoneProgress from "./MilestoneProgress.tsx";
import ActionButtons from "./ActionButtons.tsx";
import { COLORS } from "../../utils/color";

interface Milestone {
    id: number;
    name: string;
    description: string;
    completionDate: string;
    isOpened: boolean;
    openIssueNum: number;
    closedIssueNum: number;
}

interface MilestoneItemProps {
    milestone: Milestone;
    onToggleStatus: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export default function MilestoneItem({ milestone, onToggleStatus, onEdit, onDelete }: MilestoneItemProps) {
    const totalIssues = milestone.openIssueNum + milestone.closedIssueNum;
    const percentage = totalIssues > 0 ? Math.round((milestone.closedIssueNum / totalIssues) * 100) : 0;

    return (
        <div className="flex items-center justify-between px-8 py-6 bg-white border-t border-slate-200 first:border-t-0 hover:bg-slate-50 transition-colors">
            {/* 좌측: 마일스톤 정보 */}
            <div className="flex flex-col gap-2 flex-grow">
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke={COLORS.BLUE} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20v-6a2 2 0 012-2h4.5m0 0l-3-3m3 3l-3 3M9 8V4m0 4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2a2 2 0 002-2V8z"></path>
                    </svg>
                    <h3 className="text-[18px] font-bold text-[#14142B]">{milestone.name}</h3>
                    {milestone.completionDate && (
                        <div className="flex items-center gap-1 ml-2 text-xs text-slate-400">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <span>{milestone.completionDate}</span>
                        </div>
                    )}
                </div>
                <p className="text-sm text-slate-500 max-w-2xl truncate">
                    {milestone.description || "설명이 없습니다."}
                </p>
            </div>

            {/* 우측: 진행률 및 액션 */}
            <div className="flex flex-col items-end gap-4 shrink-0">
                <ActionButtons 
                    isOpened={milestone.isOpened}
                    onToggleStatus={onToggleStatus}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
                <MilestoneProgress 
                    percentage={percentage}
                    openCount={milestone.openIssueNum}
                    closedCount={milestone.closedIssueNum}
                />
            </div>
        </div>
    );
}
