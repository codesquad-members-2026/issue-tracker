// src/components/milestone/AddMilestoneButton.tsx
import { COLORS } from "../../utils/color";

interface AddMilestoneButtonProps {
    onClick: () => void;
    disabled: boolean;
}

export default function AddMilestoneButton({ onClick, disabled }: AddMilestoneButtonProps) {
    return (
        <button 
            onClick={onClick}
            disabled={disabled}
            className="flex items-center justify-center px-6 h-10 bg-[#007AFF] text-white rounded-xl text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0062CC] transition-colors"
            style={{ backgroundColor: disabled ? COLORS.GRAY : COLORS.BLUE }}
        >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            마일스톤
        </button>
    );
}
