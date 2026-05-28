import { api } from './index';
import type { MilestoneListResponse, Milestone, CommonResponse } from '../types/Issue';

export const milestoneApi = {
    getMilestones: (state: 'OPEN' | 'CLOSED' = 'OPEN') => 
        api.get<MilestoneListResponse>('/api/milestones', { state }),
    getMilestone: (id: number) => api.get<CommonResponse<Milestone>>(`/api/milestones/${id}`),
    createMilestone: (data: Partial<Milestone>) => api.post<CommonResponse<Milestone>>('/api/milestones', data),
    updateMilestone: (id: number, data: Partial<Milestone>) => api.patch<CommonResponse<Milestone>>(`/api/milestones/${id}`, data),
    updateMilestoneState: (id: number, state: 'OPEN' | 'CLOSED') => 
        api.patch<CommonResponse<Milestone>>(`/api/milestones/${id}/state`, { state }),
    deleteMilestone: (id: number) => api.delete<CommonResponse<{ deletedMilestoneId: number }>>(`/api/milestones/${id}`),
};
