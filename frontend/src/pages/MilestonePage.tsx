// src/pages/MilestonePage.tsx
import { useState, useEffect, useCallback } from "react";
import TabNavigation from "../components/TabNavigation.tsx";
import ListContainer from "../components/ListContainer.tsx";
import AddMilestoneButton from "../components/milestone/AddMilestoneButton.tsx";
import MilestoneListHeader from "../components/milestone/MilestoneListHeader.tsx";
import MilestoneItem from "../components/milestone/MilestoneItem.tsx";
import MilestoneForm from "../components/milestone/MilestoneForm.tsx";

// --- Types ---
interface Milestone {
    id: number;
    name: string;
    description: string;
    completionDate: string;
    isOpened: boolean;
    openIssueNum: number;
    closedIssueNum: number;
}

interface MilestoneListResponse {
    success: boolean;
    data: {
        milestones: Milestone[];
    };
}

export default function MilestonePage() {
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [counts, setCounts] = useState({ label: 0, milestone: 0, openMilestone: 0, closedMilestone: 0 });
    const [isOpenedFilter, setIsOpenedFilter] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingData, setEditingData] = useState<Milestone | null>(null);

    // 1. 전체 데이터 및 목록 조회
    const fetchData = useCallback(async () => {
        try {
            // 레이블/마일스톤 메타데이터 (전체 개수용)
            const metaRes = await fetch(`${import.meta.env.VITE_API_URL}/api/labels`);
            const metaResult = await metaRes.json();
            
            // 열린 마일스톤 목록
            const openRes = await fetch(`${import.meta.env.VITE_API_URL}/api/milestones?state=OPEN`);
            const openResult: MilestoneListResponse = await openRes.json();

            // 닫힌 마일스톤 목록
            const closedRes = await fetch(`${import.meta.env.VITE_API_URL}/api/milestones?state=CLOSED`);
            const closedResult: MilestoneListResponse = await closedRes.json();

            if (metaResult.success && openResult.success && closedResult.success) {
                const openMilestones = openResult.data.milestones;
                const closedMilestones = closedResult.data.milestones;
                
                // 현재 필터에 맞는 목록 표시
                setMilestones(isOpenedFilter ? openMilestones : closedMilestones);
                
                setCounts({
                    label: metaResult.data.metadata.labelCount,
                    milestone: metaResult.data.metadata.milestoneCount,
                    openMilestone: openMilestones.length,
                    closedMilestone: closedMilestones.length
                });
            }
        } catch (error) {
            console.error("데이터 로딩 실패:", error);
        }
    }, [isOpenedFilter]);

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            await fetchData();
            setIsLoading(false);
        };
        void load();
    }, [fetchData]);

    // 2. 편집 시작 (단건 조회)
    const handleEditStart = async (milestone: Milestone) => {
        setIsAdding(false);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/milestones/${milestone.id}`);
            const result = await response.json();
            if (result.success) {
                setEditingData(result.data);
                setEditingId(milestone.id);
            }
        } catch (error) {
            console.error("마일스톤 상세 로딩 실패:", error);
            setEditingData(milestone);
            setEditingId(milestone.id);
        }
    };

    // 3. 저장 (생성/수정)
    const handleSave = async (data: { name: string; description: string; completionDate: string }) => {
        const isEdit = !!editingId;
        const url = isEdit ? `${import.meta.env.VITE_API_URL}/api/milestones/${editingId}` : `${import.meta.env.VITE_API_URL}/api/milestones`;
        const method = isEdit ? "PATCH" : "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: data.name,
                    description: data.description,
                    completionDate: data.completionDate
                })
            });
            const result = await response.json();

            if (result.success) {
                void fetchData();
                setIsAdding(false);
                setEditingId(null);
                setEditingData(null);
            }
        } catch (error) {
            console.error("마일스톤 저장 실패:", error);
        }
    };

    // 4. 삭제
    const handleDelete = async (id: number) => {
        if (!window.confirm("정말로 이 마일스톤을 삭제하시겠습니까?")) return;
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/milestones/${id}`, {
                method: "DELETE"
            });
            const result = await response.json();
            if (result.success) {
                void fetchData();
            }
        } catch (error) {
            console.error("마일스톤 삭제 실패:", error);
        }
    };

    // 5. 상태 변경 (열기/닫기)
    const handleToggleStatus = async (milestone: Milestone) => {
        const nextState = milestone.isOpened ? "CLOSED" : "OPEN";
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/milestones/${milestone.id}/state`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ state: nextState })
            });
            const result = await response.json();
            if (result.success) {
                void fetchData();
            }
        } catch (error) {
            console.error("마일스톤 상태 변경 실패:", error);
        }
    };

    const isBusy = isAdding || editingId !== null;

    return (
        <main className="max-w-[1440px] mx-auto px-6 py-10">
            <div className="flex justify-between items-center mb-6">
                <TabNavigation labelCount={counts.label} milestoneCount={counts.milestone} />
                <AddMilestoneButton 
                    onClick={() => {
                        setEditingId(null);
                        setEditingData(null);
                        setIsAdding(!isAdding);
                    }}
                    disabled={isBusy && !isAdding}
                />
            </div>

            {isAdding && (
                <MilestoneForm 
                    mode="create"
                    onClose={() => setIsAdding(false)}
                    onSave={handleSave}
                />
            )}

            <ListContainer>
                <MilestoneListHeader 
                    openCount={counts.openMilestone}
                    closedCount={counts.closedMilestone} 
                    isOpened={isOpenedFilter}
                    onStatusChange={setIsOpenedFilter}
                />


                <div className="flex flex-col">
                    {isLoading ? (
                        <div className="py-20 text-center text-slate-400 font-['Pretendard']">마일스톤을 불러오는 중입니다...</div>
                    ) : milestones.length > 0 ? (
                        milestones.map(ms => (
                            editingId === ms.id && editingData ? (
                                <div key={ms.id} className="p-8 border-t border-slate-200 bg-slate-50">
                                    <MilestoneForm 
                                        mode="edit"
                                        initialData={editingData}
                                        onClose={() => {
                                            setEditingId(null);
                                            setEditingData(null);
                                        }}
                                        onSave={handleSave}
                                    />
                                </div>
                            ) : (
                                <MilestoneItem 
                                    key={ms.id}
                                    milestone={ms}
                                    onToggleStatus={() => handleToggleStatus(ms)}
                                    onEdit={() => handleEditStart(ms)}
                                    onDelete={() => handleDelete(ms.id)}
                                />
                            )
                        ))
                    ) : (
                        <div className="py-20 text-center text-slate-400 font-['Pretendard']">등록된 마일스톤이 없습니다.</div>
                    )}
                </div>
            </ListContainer>
        </main>
    );
}
