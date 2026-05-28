// src/pages/IssueListPage.tsx
import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import FilterBar from "../components/issue/FilterBar.tsx";
import TabNavigation from "../components/TabNavigation.tsx";
import IssueListHeader from "../components/issue/IssueListHeader.tsx";
import IssueItem, {type IssueType} from "../components/issue/IssueItem.tsx";
import IssueSelectionHeader from "../components/issue/IssueSelectionHeader.tsx";
import type { IssueResponse, User, Label, Milestone } from "../types/Issue";
import { parseFilterString, buildFilterString } from "../utils/filterParser";

export default function IssueListPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const q = searchParams.get('q') || 'is:open';

    const [issues, setIssues] = useState<IssueType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const [metadata, setMetadata] = useState<{
        members: User[];
        labels: Label[];
        milestones: Milestone[];
    }>({ members: [], labels: [], milestones: [] });
    const [isMetadataLoaded, setIsMetadataLoaded] = useState(false);

    const [counts, setCounts] = useState({
        open: 0,
        closed: 0,
        label: 0,
        milestone: 0
    });

    // 메타데이터 로딩
    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const [membersRes, labelsRes, milestonesOpenRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_URL}/api/members`),
                    fetch(`${import.meta.env.VITE_API_URL}/api/labels`),
                    fetch(`${import.meta.env.VITE_API_URL}/api/milestones?state=OPEN`)
                ]);
                const members = await membersRes.json();
                const labels = await labelsRes.json();
                const milestonesOpen = await milestonesOpenRes.json();

                if (members.success && labels.success && milestonesOpen.success) {
                    setMetadata({
                        members: members.data || [],
                        labels: labels.data?.labels || [],
                        milestones: milestonesOpen.data?.milestones || []
                    });

                    setCounts(prev => ({
                        ...prev,
                        label: labels.data.metadata.labelCount,
                        milestone: labels.data.metadata.milestoneCount
                    }));
                }
            } catch (error) {
                console.error("메타데이터를 불러오는데 실패했습니다.", error);
            } finally {
                setIsMetadataLoaded(true);
            }
        };
        void fetchMetadata();
    }, []);

    const tokens = useMemo(() => parseFilterString(q), [q]);

    // '@me'를 현재 로그인한 유저('완자')로 치환한 토큰 생성
    const resolvedTokens = useMemo(() => {
        const resolveMe = (val?: string) => val === '@me' ? '완자' : val;
        const resolveMeArray = (arr?: string[]) => arr?.map(val => val === '@me' ? '완자' : val);

        return {
            ...tokens,
            author: resolveMe(tokens.author),
            assignee: resolveMeArray(tokens.assignee),
            commentAuthor: resolveMe(tokens.commentAuthor),
        };
    }, [tokens]);

    useEffect(() => {
        const fetchIssues = async () => {
            if (!isMetadataLoaded) return;

            try {
                setIsLoading(true);
                
                // tokens를 API 파라미터로 변환
                const params = new URLSearchParams();
                
                // 파서가 인식한 토큰이 하나라도 있는지 확인 (키워드 입력 여부)
                const hasAnyToken = Object.keys(tokens).length > 0;

                // 1. 키워드 없이 글자만 입력한 경우 ('막 입력') -> 'is:open'으로 초기화
                if (!hasAnyToken && q.trim() !== '' && q !== 'is:open') {
                    setSearchParams({ q: 'is:open' });
                    return;
                }

                // 2. 구조화된 필터 처리: 존재하지 않는 메타데이터일 경우 -1을 보내서 검색 결과 0 유도
                if (resolvedTokens.is) {
                    params.append('isOpened', (resolvedTokens.is === 'open').toString());
                }
                
                if (resolvedTokens.author) {
                    const author = metadata.members.find(m => m.name === resolvedTokens.author);
                    params.append('authorId', author ? author.id.toString() : '-1');
                }
                
                if (resolvedTokens.assignee) {
                    resolvedTokens.assignee.forEach(name => {
                        const member = metadata.members.find(m => m.name === name);
                        params.append('assigneeIds', member ? member.id.toString() : '-1');
                    });
                }

                if (resolvedTokens.label) {
                    resolvedTokens.label.forEach(name => {
                        const label = metadata.labels.find(l => l.name === name);
                        params.append('labelIds', label ? label.id.toString() : '-1');
                    });
                }

                if (resolvedTokens.milestone) {
                    const milestone = metadata.milestones.find(m => m.name === resolvedTokens.milestone);
                    params.append('milestoneId', milestone ? milestone.id.toString() : '-1');
                }

                if (resolvedTokens.commentAuthor) {
                    const member = metadata.members.find(m => m.name === resolvedTokens.commentAuthor);
                    params.append('commentAuthorId', member ? member.id.toString() : '-1');
                }

                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/issues/filter?${params.toString()}`);
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
    }, [resolvedTokens, metadata, isMetadataLoaded, q, setSearchParams, tokens]);

    const handleSearchSubmit = (newQ: string) => {
        setSearchParams({ q: newQ });
    };

    const handleStatusChange = (newStatus: 'open' | 'closed') => {
        const newTokens = { ...tokens, is: newStatus };
        setSearchParams({ q: buildFilterString(newTokens) });
    };

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
                <FilterBar
                    initialSearchText={q}
                    onSearchSubmit={handleSearchSubmit}
                />
                <div className="flex items-center gap-6">
                    <TabNavigation
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

            <div className="bg-white border border-slate-200 rounded-[16px] shadow-sm">
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
                        currentStatus={tokens.is}
                        onStatusChange={handleStatusChange}
                        metadata={metadata}
                        tokens={resolvedTokens}
                        onFilterChange={handleSearchSubmit}
                    />
                )}
                <div className="flex flex-col relative">
                    {isLoading ? (
                        <div className="py-20 text-center text-slate-400 font-['Pretendard']">
                            이슈를 불러오는 중입니다...
                        </div>
                    ) : issues.length > 0 ? (
                        issues.map((issue, index) => (
                            <IssueItem
                                key={issue.id}
                                issue={issue}
                                isSelected={selectedIds.includes(issue.id)}
                                onToggle={() => handleToggleItem(issue.id)}
                                isLast={index === issues.length - 1}
                            />
                        ))
                    ) : (
                        <div className="py-20 text-center text-slate-400 font-['Pretendard'] rounded-b-[16px]">
                            등록된 이슈가 없습니다.
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}