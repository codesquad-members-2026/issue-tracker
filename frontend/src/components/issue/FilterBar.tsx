// src/components/FilterBar.tsx
// import { useState, KeyboardEvent } from 'react';

import { useState, useEffect, type KeyboardEvent } from 'react';

interface FilterBarProps {
    initialSearchText: string;
    onSearchSubmit?: (searchText: string) => void;
}

const FILTER_OPTIONS = [
    { label: '열린 이슈', query: 'is:open' },
    { label: '내가 작성한 이슈', query: 'is:open author:@me' }, // @me는 세션 유저명으로 치환됨
    { label: '나에게 할당된 이슈', query: 'is:open assignee:@me' },
    { label: '내가 댓글을 남긴 이슈', query: 'is:open mentions:@me' },
    { label: '닫힌 이슈', query: 'is:closed' }
];

export default function FilterBar({ initialSearchText, onSearchSubmit }: FilterBarProps) {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    // 1. 검색바 입력값을 관리할 상태 추가 (props와 동기화)
    const [searchText, setSearchText] = useState(initialSearchText);
    const [selectedFilter, setSelectedFilter] = useState('열린 이슈');

    useEffect(() => {
        setSearchText(initialSearchText);
        
        // 검색어와 일치하는 필터 옵션 찾기
        const matchingOption = FILTER_OPTIONS.find(opt => opt.query === initialSearchText);
        if (matchingOption) {
            setSelectedFilter(matchingOption.label);
        } else {
            setSelectedFilter(''); // 커스텀 검색어인 경우 선택 해제
        }
    }, [initialSearchText]);

    const togglePopup = () => setIsPopupOpen(!isPopupOpen);
    const closePopup = () => setIsPopupOpen(false);

    const handleSearch = () => {
        console.log(`쿼리스트링: ${encodeURIComponent(searchText)}`);

        // 부모 컴포넌트(IssueListPage)가 전달한 콜백이 있다면 실행
        if (onSearchSubmit) {
            onSearchSubmit(searchText);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="relative">
            <div className="flex items-center w-[560px] h-10 bg-[#D9DBE9] border border-[#D9DBE9] rounded-xl overflow-hidden gap-[1px] relative z-10">
                {/* 필터 버튼 */}
                <button
                    onClick={togglePopup}
                    className="flex items-center justify-between w-[128px] h-full px-6 bg-[#F7F7FC] hover:bg-white transition-colors cursor-pointer"
                >
                    <span className="text-sm font-medium text-[#4E4B66]">필터</span>
                    <svg className="w-4 h-4 text-[#4E4B66]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>

                {/* 검색 입력창 영역 */}
                <div className="flex items-center flex-1 h-full px-6 bg-[#EFF0F6] gap-2">
                    {/* 검색 버튼 (돋보기 아이콘을 버튼으로 변경) */}
                    <button
                        onClick={handleSearch}
                        className="p-1 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                        aria-label="검색 실행"
                    >
                        <svg className="w-4 h-4 text-[#A0A3BD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </button>

                    <input
                        type="text"
                        id="searchFilterInput" // 카멜 표기법 적용
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search Issues"
                        className="w-full h-6 bg-transparent text-sm text-[#14142B] placeholder-[#6E7191] focus:outline-none"
                    />
                </div>
            </div>

            {/* 배경막 및 팝업창 */}
            {isPopupOpen && (
                <>
                    <div className="fixed inset-0 z-40 cursor-default" onClick={closePopup} />
                    <div
                        id="filterPopup"
                        className="absolute w-[240px] top-[48px] left-0 bg-[#D9DBE9] rounded-[16px] border border-[#D9DBE9] shadow-[0_0_8px_0_rgba(20,20,43,0.04)] z-50 overflow-hidden flex flex-col gap-[1px]"
                    >
                        <div className="w-full h-8 px-4 py-2 bg-[#F7F7FC] flex items-center">
                            <span className="text-[12px] font-medium text-[#4E4B66]">이슈 필터</span>
                        </div>

                        <div className="flex flex-col gap-[1px]">
                            {FILTER_OPTIONS.map((option) => {
                                const isSelected = selectedFilter === option.label;
                                return (
                                    <button
                                        key={option.label}
                                        onClick={() => {
                                            setSelectedFilter(option.label);
                                            if (onSearchSubmit) {
                                                onSearchSubmit(option.query);
                                            }
                                            closePopup();
                                        }}
                                        className="w-full h-[44px] px-4 py-2 bg-[#FEFEFE] hover:bg-[#F7F7FC] flex items-center justify-between transition-colors cursor-pointer"
                                    >
                                        <span className={`text-[16px] leading-6 text-[#14142B] font-['Pretendard_Variable'] ${isSelected ? 'font-bold' : 'font-medium'}`}>
                                            {option.label}
                                        </span>
                                        <svg className="w-4 h-4 text-[#4E4B66]" viewBox="0 0 16 16" fill="none">
                                            <circle cx="8" cy="8" r="7.2" stroke="currentColor" strokeWidth="1.6"/>
                                            {isSelected && (
                                                <path d="M5.33 8.33L7.33 10.33L10.67 6.67" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                            )}
                                        </svg>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}