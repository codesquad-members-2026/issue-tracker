import { useState, useEffect, useCallback } from 'react';
import { issueApi } from '../api/issue';
import type { IssueType, IssueListResponse, Issue, Label } from '../types/Issue';

interface UseIssuesProps {
    status?: 'open' | 'closed';
    filterParams?: URLSearchParams;
}

export function useIssues({ status, filterParams }: UseIssuesProps) {
    const [issues, setIssues] = useState<IssueType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [counts, setCounts] = useState({
        open: 0,
        closed: 0,
        label: 0,
        milestone: 0
    });

    const fetchIssues = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            let result: IssueListResponse;
            if (filterParams) {
                result = await issueApi.getFilteredIssues(filterParams);
            } else {
                result = await issueApi.getIssues({ status });
            }

            if (result.success && result.data) {
                const mappedIssues: IssueType[] = result.data.issues.map((apiIssue: Issue) => ({
                    id: apiIssue.id,
                    status: apiIssue.isOpened ? 'open' : 'closed',
                    title: apiIssue.title,
                    labels: apiIssue.labels.map((label: Label) => ({
                        text: label.name,
                        color: label.backgroundColor,
                        textColor: label.textColor
                    })),
                    authorName: apiIssue.author.name,
                    timestamp: apiIssue.createdAt,
                    milestoneTitle: apiIssue.milestone ? apiIssue.milestone.name : null
                }));

                setIssues(mappedIssues);
                setCounts({
                    open: result.data.metadata.openIssueCount,
                    closed: result.data.metadata.closedIssueCount,
                    label: result.data.metadata.labelCount,
                    milestone: result.data.metadata.milestoneCount
                });
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Unknown error'));
            console.error("이슈 목록을 불러오는데 실패했습니다.", err);
        } finally {
            setIsLoading(false);
        }
    }, [status, filterParams]);

    useEffect(() => {
        const load = async () => {
            await fetchIssues();
        };
        void load();
    }, [fetchIssues]);

    return { issues, isLoading, error, counts, refetch: fetchIssues };
}
