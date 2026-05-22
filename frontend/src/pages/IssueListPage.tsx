// src/pages/IssueListPage.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FilterBar from "../components/FilterBar.tsx";
import LabelMilestoneTabs from "../components/LabelMilestoneTabs.tsx";
import IssueListHeader from "../components/IssueListHeader.tsx";
import IssueItem, {type IssueType} from "../components/IssueItem.tsx";
import IssueSelectionHeader from "../components/IssueSelectionHeader.tsx";
import type { IssueResponse } from "../types/Issue";

export default function IssueListPage() {
    const [issues, setIssues] = useState<IssueType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    // 현재 탭 상태 관리 (open 또는 closed)
    const [status, setStatus] = useState<'open' | 'closed'>('open');

    const [counts, setCounts] = useState({
        open: 0,
        closed: 0,
        label: 0,
        milestone: 0
    });

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/issues?status=${status}`);
                const result: IssueResponse = await response.json();

                if(result.success){
                    const mappedIssues: IssueType[] = result.data.issues.map((apiIssue) => ({
                        id: apiIssue.id,
                        status: apiIssue.isOpened ? 'open' : 'closed',
                        title: apiIssue.title,
                        labels: apiIssue.labels.map(label => ({
                            text: label.name,
                            color: label.backgroundColor
                        })),
                        authorName: apiIssue.author.name,
                        timestamp: apiIssue.createdAt,
                        milestoneTitle: apiIssue.milestone ? apiIssue.milestone.name : null
                    }));

                    setIssues(mappedIssues);
                    setSelectedIds([]);

                    setCounts({
                        open: result.data.metadata.openIssueCount,
                        closed: result.data.metadata.closedIssueCount,
                        label: result.data.metadata.labelCount,
                        milestone: result.data.metadata.milestoneCount
                    });
                }
            } catch (error) {
                console.error("이슈 목록을 불러오는데 실패했습니다.", error);
            } finally {
                setIsLoading(false);
            }
        };

        void fetchIssues();
    }, [status]);

    const handleToggleItem = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
        );
    };

    const isAllSelected = issues.length > 0 && selectedIds.length === issues.length;
    const hasSelection = selectedIds.length > 0;

    const handleToggleAll = () => {
        if(selectedIds.length === issues.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(issues.map(issue => issue.id));
        }
    }

    return (
        <main className="max-w-[1440px] mx-auto px-6 py-10">
            <div className="flex justify-between items-center mb-6">
                <FilterBar />
                <div className="flex items-center gap-6">
                    <LabelMilestoneTabs
                        labelCount={counts.label}
                        milestoneCount={counts.milestone}
                    />
                    <Link
                        to="/issues/new"
                        className="flex items-center justify-center px-6 h-10 bg-[#007AFF] text-white rounded-xl text-sm font-bold"
                    >
                        + 이슈 작성
                    </Link>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                {hasSelection ? (
                    <IssueSelectionHeader
                        selectedCount={selectedIds.length}
                        isAllSelected={isAllSelected}
                        onToggleAll={handleToggleAll}
                    />
                ):(
                    <IssueListHeader
                        isAllSelected={isAllSelected}
                        onToggleAll={handleToggleAll}
                        openCount={counts.open}
                        closedCount={counts.closed}
                        currentStatus={status}
                        onStatusChange={setStatus}
                    />
                )}
                <div className="flex flex-col relative">
                    {isLoading ? (
                        <div className="py-20 text-center text-slate-400 font-['Pretendard']">
                            이슈를 불러오는 중입니다...
                        </div>
                    ) : issues.length > 0 ? (
                        issues.map((issue) => (
                            <IssueItem
                                key={issue.id}
                                issue={issue}
                                isSelected={selectedIds.includes(issue.id)}
                                onToggle={() => handleToggleItem(issue.id)}
                            />
                        ))
                    ) : (
                        <div className="py-20 text-center text-slate-400 font-['Pretendard']">
                            등록된 이슈가 없습니다.
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}