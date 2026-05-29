// src/components/milestone/MilestoneForm.tsx
import { useState } from "react";
import { COLORS } from "../../utils/color.ts";

interface MilestoneData {
    id?: number;
    name: string;
    description?: string;
    completionDate?: string; // "yy. MM. dd" or "yyyy-MM-dd" depending on input
}

interface MilestoneFormProps {
    mode: "create" | "edit";
    initialData?: MilestoneData;
    onClose: () => void;
    onSave: (data: MilestoneData) => void;
}

function FormInputRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-4 px-4 h-10 bg-slate-100 border border-slate-200 rounded-xl focus-within:bg-white focus-within:border-slate-300 focus-within:ring-2 focus-within:ring-[#007AFF] transition-all">
            <label className="w-24 text-xs font-bold text-slate-500 flex-shrink-0">{label}</label>
            <div className="flex-grow h-full flex items-center">{children}</div>
        </div>
    );
}

/**
 * 'yy. MM. dd' 형식을 'YYYY-MM-DD' 형식으로 변환합니다.
 */
function formatDateForInput(dateStr: string | undefined): string {
    if (!dateStr) return "";
    // 이미 'YYYY-MM-DD' 형식인 경우 그대로 반환
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    
    // 'yy. MM. dd' -> '20yy-MM-DD' 변환
    const parts = dateStr.split(".").map(p => p.trim());
    if (parts.length === 3) {
        const year = parts[0].length === 2 ? `20${parts[0]}` : parts[0];
        const month = parts[1].padStart(2, "0");
        const day = parts[2].padStart(2, "0");
        return `${year}-${month}-${day}`;
    }
    return "";
}

/**
 * 'YYYY-MM-DD' 형식을 'yyyy. MM. dd' 형식으로 변환합니다.
 */
function formatDateForServer(dateStr: string): string {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
        return `${parts[0]}. ${parts[1]}. ${parts[2]}`;
    }
    return dateStr;
}

export default function MilestoneForm({ mode, initialData, onClose, onSave }: MilestoneFormProps) {
    const formattedDate = formatDateForInput(initialData?.completionDate);
    const [name, setName] = useState(initialData?.name || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [completionDate, setCompletionDate] = useState(formattedDate);

    const isUnchanged = mode === "edit" && 
        name === initialData?.name && 
        description === initialData?.description && 
        completionDate === formattedDate;

    const handleSubmit = () => {
        if (!name.trim() || isUnchanged) return;
        onSave({
            id: initialData?.id,
            name,
            description,
            completionDate: formatDateForServer(completionDate)
        });
    };

    const today = new Date().toISOString().split("T")[0];

    return (
        <div className={`bg-white border border-slate-200 rounded-xl shadow-sm p-8 animate-in fade-in slide-in-from-top-4 duration-300 ${mode === "create" ? "mb-6" : ""}`}>
            <h2 className="text-xl font-bold mb-8">
                {mode === "create" ? "새로운 마일스톤 추가" : "마일스톤 편집"}
            </h2>

            <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                    <div className="flex-grow">
                        <FormInputRow label="이름">
                            <input 
                                type="text" 
                                placeholder="마일스톤 이름을 입력하세요"
                                className="w-full bg-transparent focus:outline-none text-sm font-['Pretendard']"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </FormInputRow>
                    </div>
                    <div className="w-1/3">
                        <FormInputRow label="완료일(선택)">
                            <input 
                                type="date" 
                                min={today}
                                className="w-full bg-transparent focus:outline-none text-sm font-['Pretendard'] cursor-pointer"
                                value={completionDate}
                                onChange={(e) => setCompletionDate(e.target.value)}
                            />
                        </FormInputRow>
                    </div>
                </div>


                <FormInputRow label="설명(선택)">
                    <input 
                        type="text" 
                        placeholder="마일스톤에 대한 설명을 입력하세요"
                        className="w-full bg-transparent focus:outline-none text-sm font-['Pretendard']"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </FormInputRow>

                <div className="flex justify-end gap-2 mt-4">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 border border-[#007AFF] text-[#007AFF] rounded-xl font-bold hover:bg-slate-50 transition-colors"
                        style={{ borderColor: COLORS.BLUE, color: COLORS.BLUE }}
                    >
                        취소
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={!name.trim() || isUnchanged}
                        className="px-6 py-2 bg-[#007AFF] text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0062CC] transition-colors"
                        style={{ backgroundColor: isUnchanged ? COLORS.GRAY : COLORS.BLUE }}
                    >
                        완료
                    </button>
                </div>
            </div>
        </div>
    );
}
