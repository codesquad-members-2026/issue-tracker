// src/components/TabNavigation.tsx
import { NavLink } from "react-router-dom";

interface TabNavigationProps {
    labelCount: number;
    milestoneCount: number;
}

export default function TabNavigation({ labelCount, milestoneCount }: TabNavigationProps) {
    const activeClass = "bg-white text-[#14142B] font-bold";
    const inactiveClass = "bg-[#F7F7FC] text-[#4E4B66] font-medium hover:bg-white";

    return (
        <div className="flex w-[320px] h-10 bg-[#D9DBE9] border border-[#D9DBE9] rounded-xl overflow-hidden gap-[1px]">
            <NavLink 
                to="/labels"
                className={({ isActive }) => 
                    `flex-1 flex items-center justify-center gap-1 transition-colors cursor-pointer ${isActive ? activeClass : inactiveClass}`
                }
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
                <span className="font-['Pretendard'] text-[16px]">
                    레이블({labelCount})
                </span>
            </NavLink>

            <NavLink 
                to="/milestones"
                className={({ isActive }) => 
                    `flex-1 flex items-center justify-center gap-1 transition-colors cursor-pointer ${isActive ? activeClass : inactiveClass}`
                }
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20v-6a2 2 0 012-2h4.5m0 0l-3-3m3 3l-3 3M9 8V4m0 4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2a2 2 0 002-2V8z"></path>
                </svg>
                <span className="font-['Pretendard'] text-[16px]">
                    마일스톤({milestoneCount})
                </span>
            </NavLink>
        </div>
    );
}
