// src/pages/IssueListPage.tsx

import { useState, useEffect } from "react";
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

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                // TODO: 하드코딩 된 api 요청 추후에 변경 요망
                const response = await fetch("http://localhost:8080/api/issues");
                const result: IssueResponse = await response.json();

                if(result.success){
                    const mappedIssues: IssueType[] = result.data.issues.map((apiIssue) => {
                        return {
                            id: apiIssue.id,
                            status: apiIssue.opened ? 'open' : 'closed',
                            title: apiIssue.title,
                            labels: apiIssue.labels.map(label => ({
                                text: label.name,
                                color: label.backgroundColor
                            })),
                            authorName: apiIssue.author.name,
                            timestamp: apiIssue.createdAt,
                            milestoneTitle: apiIssue.milestone ? apiIssue.milestone.name : null
                        }
                    });

                    setIssues(mappedIssues);
                }
            } catch (error) {
                console.error("이슈 목록을 불러오는데 실패했습니다.", error);
            } finally {
                setIsLoading(false);
            }
        };

        void fetchIssues();
    }, []);

    // 개별 아이템 선택 토글 함수
    const handleToggleItem = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
        );
    };

    const isAllSelected = issues.length > 0 && selectedIds.length === issues.length;
    const hasSelection = selectedIds.length > 0;

    // 전체 선택/해제 토글 함수
    const handleToggleAll = () => {
        if(selectedIds.length === issues.length) {
            setSelectedIds([]); // 모두 선택된 상태면 전체 해제
        } else {
            setSelectedIds(issues.map(issue => issue.id)); // 아니면 전체 선택
        }
    }

    if(isLoading) {
        return <main className="max-w-[1440px] mx-auto px-6 py-10 text-center">데이터를 불러오는 중입니다...</main>;
    }

    return (
        <main className="max-w-[1440px] mx-auto px-6 py-10">
            {/* 상단 필터/버튼 영역 */}
            <div className="flex justify-between items-center mb-6">
                <FilterBar />
                <div className="flex items-center gap-6">
                    <LabelMilestoneTabs />
                    <button className="flex items-center justify-center px-6 h-10 bg-[#007AFF] text-white rounded-xl text-sm font-bold">
                        + 이슈 작성
                    </button>
                </div>
            </div>

            {/* 이슈 목록 영역 */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                {/* 4. 조건부 헤더 렌더링: 하나라도 선택되면 SelectionHeader, 아니면 기본 Header */}
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
                        />
                )}

                <div className="flex flex-col">
                    {issues.map((issue) => (
                        <IssueItem 
                            key={issue.id} 
                            issue={issue} 
                            isSelected={selectedIds.includes(issue.id)} // 선택 여부 주입
                            onToggle={() => handleToggleItem(issue.id)} // 토글 함수 주입
                        /> 
                    ))}
                </div>
            </div>
        </main>
    );
}