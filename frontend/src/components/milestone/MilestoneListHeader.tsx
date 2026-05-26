// src/components/milestone/MilestoneListHeader.tsx
import ListHeader from "../ListHeader.tsx";

interface MilestoneListHeaderProps {
    openCount: number;
    closedCount: number;
    isOpened: boolean;
    onStatusChange: (isOpened: boolean) => void;
}

export default function MilestoneListHeader({ openCount, closedCount, isOpened, onStatusChange }: MilestoneListHeaderProps) {
    const activeClass = "font-bold text-[#14142B]";
    const inactiveClass = "font-medium text-[#4E4B66]";

    return (
        <ListHeader>
            <div className="flex gap-6">
                <button 
                    onClick={() => onStatusChange(true)}
                    className={`flex items-center gap-1 text-sm transition-colors ${isOpened ? activeClass : inactiveClass}`}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" strokeWidth="2"></circle>
                        <path d="M12 8v4m0 4h.01" strokeWidth="2" strokeLinecap="round"></path>
                    </svg>
                    열린 마일스톤({openCount})
                </button>
                <button 
                    onClick={() => onStatusChange(false)}
                    className={`flex items-center gap-1 text-sm transition-colors ${!isOpened ? activeClass : inactiveClass}`}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    닫힌 마일스톤({closedCount})
                </button>
            </div>
        </ListHeader>
    );
}
