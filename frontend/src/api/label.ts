import { api } from './index';
import type { LabelPageResponse, Label, CommonResponse } from '../types/Issue';

export const labelApi = {
    getLabels: () => api.get<LabelPageResponse>('/api/labels'),
    getLabel: (id: number) => api.get<CommonResponse<Label>>(`/api/labels/${id}`),
    createLabel: (data: Partial<Label>) => api.post<CommonResponse<Label>>('/api/labels', data),
    updateLabel: (id: number, data: Partial<Label>) => api.patch<CommonResponse<Label>>(`/api/labels/${id}`, data),
    deleteLabel: (id: number) => api.delete<CommonResponse<{ deletedId: number }>>(`/api/labels/${id}`),
};
