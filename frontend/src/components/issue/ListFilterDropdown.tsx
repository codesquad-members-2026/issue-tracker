// src/components/ListFilterDropdown.tsx
import {useState, type ReactNode} from 'react';

interface ListFilterDropdownProps {
    title: string;
    children?: ReactNode;
}

export default function ListFilterDropdown({ title, children }: ListFilterDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => setIsOpen(!isOpen);
    const closeDropdown = () => setIsOpen(false);

    return (
        <div className="relative">
            <button
                onClick={toggleDropdown}
                className="flex items-center gap-1 text-[#4E4B66] hover:text-[#14142B] transition-colors cursor-pointer"
                >

                <span className="font-medium text-[16px]">{title}</span>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>

            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={closeDropdown} />
                    <div className="absolute top-[32px] right-0 w-[240px] z-50 ...">
                        {/* IssueListHeader 에서 주입받은 필터 팝업 */}
                        {children}
                    </div>
                </>
            )}
        </div>
    );
}