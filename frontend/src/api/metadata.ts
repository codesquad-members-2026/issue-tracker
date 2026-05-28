import { api } from './index';
import type { User, LabelPageResponse, MilestoneListResponse, CommonResponse } from '../types/Issue';

export const metadataApi = {
    getMembers: () => api.get<CommonResponse<User[]>>('/api/members'),
    getLabels: () => api.get<LabelPageResponse>('/api/labels'),
    getMilestones: (state: 'OPEN' | 'CLOSED' = 'OPEN') => 
        api.get<MilestoneListResponse>('/api/milestones', { state }),
};
