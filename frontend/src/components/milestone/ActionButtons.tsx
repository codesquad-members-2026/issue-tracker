// src/components/milestone/ActionButtons.tsx
import { COLORS } from "../../utils/color";

interface ActionButtonsProps {
    isOpened: boolean;
    onToggleStatus: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export default function ActionButtons({ isOpened, onToggleStatus, onEdit, onDelete }: ActionButtonsProps) {
    return (
        <div className="flex gap-4">
            <button 
                onClick={onToggleStatus}
                className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                {isOpened ? "닫기" : "열기"}
            </button>
            <button 
                onClick={onEdit}
                className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                편집
            </button>
            <button 
                onClick={onDelete}
                className="flex items-center gap-1 text-xs font-bold text-[#FF3B30] hover:opacity-80 transition-opacity"
                style={{ color: COLORS.RED }}
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                삭제
            </button>
        </div>
    );
}
