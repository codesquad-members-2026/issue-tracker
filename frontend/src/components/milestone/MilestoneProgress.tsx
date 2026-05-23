// src/components/milestone/MilestoneProgress.tsx
import { COLORS } from "../../utils/color";

interface MilestoneProgressProps {
    percentage: number;
    openCount: number;
    closedCount: number;
}

export default function MilestoneProgress({ percentage, openCount, closedCount }: MilestoneProgressProps) {
    return (
        <div className="flex flex-col items-end gap-2 w-[244px]">
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div 
                    className="h-full transition-all duration-500" 
                    style={{ 
                        width: `${percentage}%`,
                        backgroundColor: COLORS.BLUE 
                    }}
                />
            </div>
            <div className="flex justify-between w-full text-xs font-medium">
                <span style={{ color: COLORS.TEXT_SLATE }}>{percentage}%</span>
                <div className="flex gap-4">
                    <span style={{ color: COLORS.TEXT_SLATE }}>열린 이슈 {openCount}</span>
                    <span style={{ color: COLORS.TEXT_SLATE }}>닫힌 이슈 {closedCount}</span>
                </div>
            </div>
        </div>
    );
}
