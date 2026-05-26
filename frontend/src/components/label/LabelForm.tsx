// src/components/LabelForm.tsx
import { useState } from "react";
import Badge from "../Badge.tsx";
import { getRandomColor, getContrastColor } from "../../utils/color.ts";

interface LabelData {
    id?: number;
    name: string;
    description: string;
    backgroundColor: string;
    textColor: string;
}

interface LabelFormProps {
    mode: "create" | "edit";
    initialData?: LabelData;
    onClose: () => void;
    onSave: (data: LabelData) => void;
}

// --- Sub-components ---

function LabelPreview({ name, backgroundColor, textColor }: { name: string; backgroundColor: string; textColor: string }) {
    return (
        <div className="flex items-center justify-center w-[300px] h-[160px] bg-white border border-slate-200 rounded-xl">
            <Badge text={name || "레이블 이름"} backgroundColor={backgroundColor} textColor={textColor} />
        </div>
    );
}

function FormInputRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-4 px-4 h-10 bg-slate-100 border border-slate-200 rounded-xl focus-within:bg-white focus-within:border-slate-300 focus-within:ring-2 focus-within:ring-[#007AFF] transition-all">
            <label className="w-20 text-xs font-bold text-slate-500 flex-shrink-0">{label}</label>
            <div className="flex-grow h-full flex items-center">{children}</div>
        </div>
    );
}

function ColorPickerGroup({ backgroundColor, onColorChange, textColor, onTextColorChange }: { 
    backgroundColor: string; 
    onColorChange: (color: string) => void;
    textColor: string;
    onTextColorChange: (type: string) => void;
}) {
    const handleRandomColor = () => {
        const randomHex = getRandomColor();
        onColorChange(randomHex);
        const bestContrast = getContrastColor(randomHex);
        onTextColorChange(bestContrast === "white" ? "light" : "dark");
    };

    return (
        <div className="flex gap-4">
            <div className="flex-grow">
                <div className="flex items-center gap-2 px-4 h-10 bg-slate-100 border border-slate-200 rounded-xl focus-within:bg-white focus-within:border-slate-300 focus-within:ring-2 focus-within:ring-[#007AFF] transition-all">
                    <label className="w-20 text-xs font-bold text-slate-500 flex-shrink-0">배경 색상</label>
                    <input 
                        type="text" 
                        value={backgroundColor} 
                        onChange={(e) => {
                            const newColor = e.target.value;
                            onColorChange(newColor);
                            if (newColor.length === 7) {
                                const bestContrast = getContrastColor(newColor);
                                onTextColorChange(bestContrast === "white" ? "light" : "dark");
                            }
                        }}
                        className="flex-grow bg-transparent focus:outline-none text-sm font-['Pretendard']"
                    />
                    <button onClick={handleRandomColor} className="text-slate-500 hover:rotate-180 transition-transform duration-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div className="flex items-center gap-2 px-4 h-10 bg-slate-100 border border-slate-200 rounded-xl focus-within:bg-white focus-within:border-slate-300 transition-all">
                <label className="text-xs font-bold text-slate-500 flex-shrink-0">텍스트 색상</label>
                <select 
                    value={textColor} 
                    onChange={(e) => onTextColorChange(e.target.value)}
                    className="bg-transparent text-sm font-['Pretendard'] focus:outline-none cursor-pointer"
                >
                    <option value="dark">어두운 색</option>
                    <option value="light">밝은 색</option>
                </select>
            </div>
        </div>
    );
}

// --- Main Form ---

export default function LabelForm({ mode, initialData, onClose, onSave }: LabelFormProps) {
    const [name, setName] = useState(initialData?.name || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [backgroundColor, setBackgroundColor] = useState(initialData?.backgroundColor || "#EFF0F6");
    const [textColor, setTextColor] = useState(initialData?.textColor || "dark");

    const isUnchanged = mode === "edit" && 
        name === initialData?.name && 
        description === initialData?.description && 
        backgroundColor === initialData?.backgroundColor && 
        textColor === initialData?.textColor;

    const handleSubmit = () => {
        if (!name.trim() || isUnchanged) return;
        onSave({
            id: initialData?.id,
            name,
            description,
            backgroundColor,
            textColor
        });
    };

    return (
        <div className={`bg-white border border-slate-200 rounded-xl shadow-sm p-8 animate-in fade-in slide-in-from-top-4 duration-300 ${mode === "create" ? "mb-6" : ""}`}>
            <h2 className="text-xl font-bold mb-8">
                {mode === "create" ? "새로운 레이블 추가" : "레이블 편집"}
            </h2>

            <div className="flex gap-8">
                <LabelPreview name={name} backgroundColor={backgroundColor} textColor={textColor} />

                <div className="flex-grow flex flex-col gap-4">
                    <FormInputRow label="이름">
                        <input 
                            type="text" 
                            placeholder="레이블 이름을 입력하세요"
                            className="w-full bg-transparent focus:outline-none text-sm font-['Pretendard']"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </FormInputRow>

                    <FormInputRow label="설명(선택)">
                        <input 
                            type="text" 
                            placeholder="레이블에 대한 설명을 입력하세요"
                            className="w-full bg-transparent focus:outline-none text-sm font-['Pretendard']"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </FormInputRow>

                    <ColorPickerGroup 
                        backgroundColor={backgroundColor} 
                        onColorChange={setBackgroundColor}
                        textColor={textColor}
                        onTextColorChange={setTextColor}
                    />

                    <div className="flex justify-end gap-2 mt-4">
                        <button 
                            onClick={onClose}
                            className="px-6 py-2 border border-[#007AFF] text-[#007AFF] rounded-xl font-bold hover:bg-slate-50 transition-colors"
                        >
                            취소
                        </button>
                        <button 
                            onClick={handleSubmit}
                            disabled={!name.trim() || isUnchanged}
                            className="px-6 py-2 bg-[#007AFF] text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0062CC] transition-colors"
                        >
                            완료
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
