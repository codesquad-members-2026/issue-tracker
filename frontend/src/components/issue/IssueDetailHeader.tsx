import { getRelativeTime } from "../utils/date";
import type { IssueDetail } from "../types/Issue";

interface IssueDetailHeaderProps {
    issue: IssueDetail;
    isEditingTitle: boolean;
    editedTitle: string;
    onEditClick: () => void;
    onCancelEdit: () => void;
    onTitleChange: (value: string) => void;
    onTitleSave: () => void;
    onToggleStatus: () => void;
}

export default function IssueDetailHeader({
    issue,
    isEditingTitle,
    editedTitle,
    onEditClick,
    onCancelEdit,
    onTitleChange,
    onTitleSave,
    onToggleStatus
}: IssueDetailHeaderProps) {
    const isTitleUnchanged = editedTitle.trim() === issue.title || !editedTitle.trim();

    return (
        <header className="mb-8 pb-6 border-b border-slate-200">
            {isEditingTitle ? (
                <div className="flex justify-between items-center mb-4 gap-4 h-[52px]">
                    <div className="flex-grow flex items-center gap-4">
                        <input
                            type="text"
                            value={editedTitle}
                            onChange={(e) => onTitleChange(e.target.value)}
                            className="flex-grow max-w-[800px] px-4 py-2 border border-[#007AFF] rounded-lg text-3xl font-bold outline-none bg-slate-50 focus:bg-white transition-colors"
                            autoFocus
                        />
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={onCancelEdit}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 h-10"
                        >
                            편집 취소
                        </button>
                        <button
                            onClick={onTitleSave}
                            disabled={isTitleUnchanged}
                            className={`px-4 py-2 rounded-lg text-sm font-bold text-white transition-all h-10 ${
                                isTitleUnchanged 
                                ? "bg-[#007AFF]/50 cursor-not-allowed" 
                                : "bg-[#007AFF] hover:bg-[#0062CC]"
                            }`}
                        >
                            편집 완료
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex justify-between items-center mb-4 h-[52px]">
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-bold text-slate-800">{issue.title}</h1>
                        <span className="text-3xl font-light text-slate-400">#{issue.id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onEditClick}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 h-10"
                        >
                            제목 편집
                        </button>
                        <button
                            onClick={onToggleStatus}
                            className={`px-4 py-2 bg-white border rounded-lg text-sm font-bold transition-colors h-10 ${
                                issue.isOpened 
                                ? "border-[#FF3B30] text-[#FF3B30] hover:bg-red-50" 
                                : "border-[#007AFF] text-[#007AFF] hover:bg-blue-50"
                            }`}
                        >
                            {issue.isOpened ? "이슈 닫기" : "이슈 열기"}
                        </button>
                    </div>
                </div>
            )}

            <div className="flex items-center gap-4">
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-sm font-bold ${issue.isOpened ? 'bg-[#007AFF]' : 'bg-[#FF3B30]'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" strokeWidth="2"></circle>
                        <path d="M12 8v4m0 4h.01" strokeWidth="2" strokeLinecap="round"></path>
                    </svg>
                    {issue.isOpened ? '열린 이슈' : '닫힌 이슈'}
                </div>
                <div className="text-slate-500 text-sm">
                    <span className="font-bold text-slate-700">{issue.author.name}</span>님이 {getRelativeTime(issue.createdAt)}에 이 이슈를 열었습니다 · 코멘트 {issue.commentCount}개
                </div>
            </div>
        </header>
    );
}
