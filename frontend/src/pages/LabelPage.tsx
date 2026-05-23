// src/pages/LabelPage.tsx
import { useState, useEffect } from "react";
import TabNavigation from "../components/TabNavigation.tsx";
import AddLabelButton from "../components/label/AddLabelButton.tsx";
import LabelList from "../components/label/LabelList.tsx";
import LabelItem from "../components/label/LabelItem.tsx";
import LabelForm from "../components/label/LabelForm.tsx";

// --- Types ---
interface Label {
    id: number;
    name: string;
    description: string;
    textColor: string;
    backgroundColor: string;
}

interface LabelPageResponse {
    success: boolean;
    data: {
        metadata: {
            labelCount: number;
            milestoneCount: number;
        };
        labels: Label[];
    };
}

export default function LabelPage() {
    const [labels, setLabels] = useState<Label[]>([]);
    const [counts, setCounts] = useState({ label: 0, milestone: 0 });
    const [isLoading, setIsLoading] = useState(true);

    const [isAdding, setIsAdding] = useState(false);
    const [editingLabelId, setEditingLabelId] = useState<number | null>(null);
    const [editingLabelData, setEditingLabelData] = useState<Label | null>(null);

    useEffect(() => {
        const fetchLabels = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/labels");
                const result: LabelPageResponse = await response.json();
                if (result.success) {
                    setLabels(result.data.labels);
                    setCounts({
                        label: result.data.metadata.labelCount,
                        milestone: result.data.metadata.milestoneCount
                    });
                }
            } catch (error) {
                console.error("레이블 목록 로딩 실패:", error);
            } finally {
                setIsLoading(false);
            }
        };
        void fetchLabels();
    }, []);

    const handleEditStart = async (label: Label) => {
        setIsAdding(false);
        try {
            const response = await fetch(`http://localhost:8080/api/labels/${label.id}`);
            const result = await response.json();
            if (result.success) {
                setEditingLabelData(result.data);
                setEditingLabelId(label.id);
            }
        } catch (error) {
            console.error("레이블 상세 로딩 실패:", error);
            setEditingLabelData(label);
            setEditingLabelId(label.id);
        }
    };

    const handleSave = async (data: { name: string; description: string; backgroundColor: string; textColor: string }) => {
        const isEdit = !!editingLabelId;
        const url = isEdit ? `http://localhost:8080/api/labels/${editingLabelId}` : "http://localhost:8080/api/labels";
        const method = isEdit ? "PATCH" : "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: data.name,
                    description: data.description,
                    backgroundColor: data.backgroundColor,
                    textColor: data.textColor === "light" || data.textColor === "white" ? "#FEFEFE" : "#14142B"
                })
            });
            const result = await response.json();

            if (result.success) {
                if (isEdit) {
                    setLabels(prev => prev.map(l => l.id === editingLabelId ? result.data : l));
                    setEditingLabelId(null);
                    setEditingLabelData(null);
                } else {
                    setLabels(prev => [result.data, ...prev]);
                    setCounts(prev => ({ ...prev, label: prev.label + 1 }));
                    setIsAdding(false);
                }
            }
        } catch (error) {
            console.error("레이블 저장 실패:", error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("정말로 이 레이블을 삭제하시겠습니까?")) return;
        try {
            const response = await fetch(`http://localhost:8080/api/labels/${id}`, {
                method: "DELETE"
            });
            const result = await response.json();
            if (result.success) {
                setLabels(prev => prev.filter(l => l.id !== id));
                setCounts(prev => ({ ...prev, label: prev.label - 1 }));
            }
        } catch (error) {
            console.error("레이블 삭제 실패:", error);
        }
    };

    return (
        <main className="max-w-[1440px] mx-auto px-6 py-10">
            <div className="flex justify-between items-center mb-6">
                <TabNavigation labelCount={counts.label} milestoneCount={counts.milestone} />
                <AddLabelButton 
                    onClick={() => {
                        setEditingLabelId(null);
                        setEditingLabelData(null);
                        setIsAdding(!isAdding);
                    }}
                    disabled={isAdding || editingLabelId !== null}
                />
            </div>

            {isAdding && (
                <LabelForm 
                    mode="create"
                    onClose={() => setIsAdding(false)}
                    onSave={handleSave}
                />
            )}

            <LabelList labelCount={counts.label}>
                {isLoading ? (
                    <div className="py-20 text-center text-slate-400">레이블을 불러오는 중입니다...</div>
                ) : labels.length > 0 ? (
                    labels.map(label => (
                        editingLabelId === label.id && editingLabelData ? (
                            <div key={label.id} className="p-8 border-t border-slate-200 bg-slate-50">
                                <LabelForm 
                                    mode="edit"
                                    initialData={{
                                        ...editingLabelData,
                                        textColor: editingLabelData.textColor === "#FEFEFE" ? "light" : "dark"
                                    }}
                                    onClose={() => {
                                        setEditingLabelId(null);
                                        setEditingLabelData(null);
                                    }}
                                    onSave={handleSave}
                                />
                            </div>
                        ) : (
                            <LabelItem 
                                key={label.id} 
                                label={label} 
                                onEdit={() => handleEditStart(label)} 
                                onDelete={() => handleDelete(label.id)}
                            />
                        )
                    ))
                ) : (
                    <div className="py-20 text-center text-slate-400">등록된 레이블이 없습니다.</div>
                )}
            </LabelList>
        </main>
    );
}
