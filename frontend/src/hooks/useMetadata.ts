import { useState, useEffect } from 'react';
import { metadataApi } from '../api/metadata';
import type { User, Label, Milestone } from '../types/Issue';

export function useMetadata() {
    const [members, setMembers] = useState<User[]>([]);
    const [labels, setLabels] = useState<Label[]>([]);
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAllMetadata = async () => {
            try {
                setIsLoading(true);
                const [mRes, lRes, miRes] = await Promise.all([
                    metadataApi.getMembers(),
                    metadataApi.getLabels(),
                    metadataApi.getMilestones('OPEN')
                ]);

                if (mRes.success) setMembers(mRes.data);
                if (lRes.success) setLabels(lRes.data.labels);
                if (miRes.success) setMilestones(miRes.data.milestones);
            } catch (error) {
                console.error("데이터 로딩 실패:", error);
            } finally {
                setIsLoading(false);
            }
        };
        void fetchAllMetadata();
    }, []);

    return { members, labels, milestones, isLoading };
}
