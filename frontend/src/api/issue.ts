import { api } from './index';
import type { IssueListResponse, IssueDetailResponse, CommonResponse, Comment } from '../types/Issue';

export const issueApi = {
    getIssues: (params: { status?: 'open' | 'closed' } = {}) => 
        api.get<IssueListResponse>('/api/issues', params as Record<string, string>),
    
    getFilteredIssues: (params: URLSearchParams | Record<string, string>) => 
        api.get<IssueListResponse>('/api/issues/filter', params),
        
    getIssueDetail: (id: string | number) =>
        api.get<IssueDetailResponse>(`/api/issues/${id}`),

    deleteIssue: (issueId: number | string) => 
        api.delete<CommonResponse>(`/api/issues/${issueId}`),
        
    createIssue: (formData: FormData) => 
        api.post<CommonResponse>('/api/issues', formData),

    updateStatus: (id: string | number, status: 'OPEN' | 'CLOSED') =>
        api.patch<CommonResponse>(`/api/issues/${id}`, { status }),

    updateTitle: (id: string | number, title: string) =>
        api.patch<CommonResponse>(`/api/issues/${id}/title`, { title }),

    updateContents: (id: string | number, contents: string) =>
        api.patch<CommonResponse>(`/api/issues/${id}/contents`, { contents }),

    updateAssignees: (id: string | number, assigneeIds: number[]) =>
        api.patch<CommonResponse>(`/api/issues/${id}/assignees`, { assigneeIds }),

    updateLabels: (id: string | number, labelIds: number[]) =>
        api.patch<CommonResponse>(`/api/issues/${id}/labels`, { labelIds }),

    updateMilestone: (id: string | number, milestoneId: number | null) =>
        api.patch<CommonResponse>(`/api/issues/${id}/milestone`, { milestoneId }),

    updateIssuesStatus: (issueIds: number[], status: 'OPEN' | 'CLOSED') =>
        api.patch<CommonResponse>('/api/issues/status', { issueIds, status }),

    createComment: (issueId: string | number, contents: string) =>
        api.post<CommonResponse<Comment>>(`/api/issues/${issueId}/comments`, { contents }),

    updateComment: (issueId: string | number, commentId: number, contents: string) =>
        api.patch<CommonResponse>(`/api/issues/${issueId}/comments/${commentId}`, { contents }),
};
