// src/components/IssueSelectionHeader.tsx
import { useState } from 'react';

interface IssueSelectionHeaderProps {
    selectedCount: number;
    isAllSelected: boolean;
    onToggleAll: () => void;
}

export default function IssueSelectionHeader({
                                                 selectedCount,
                                                 isAllSelected,
                                                 onToggleAll
                                             }: IssueSelectionHeaderProps) {
    // 상태 수정 팝업 제어를 위한 상태
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    // 1. 드롭다운 내에서 어떤 동작이 일시적으로 '선택'되었는지 관리하는 상태 추가
    const [selectedAction, setSelectedAction] = useState<string | null>(null);

    // 2. 일괄 동작 옵션 정의
    const statusActions = ['선택한 이슈 열기', '선택한 이슈 닫기'];

    const togglePopup = () => {
        if (isPopupOpen) {
            setSelectedAction(null); // 팝업 닫힐 때 일시적 선택 상태 초기화
        }
        setIsPopupOpen(!isPopupOpen);
    }

    const closePopup = () => {
        setIsPopupOpen(false);
        setSelectedAction(null); // 팝업 닫힐 때 일시적 선택 상태 초기화
    };

    return (
        <div className="flex items-center w-full h-16 bg-[#F7F7FC] rounded-t-[16px] px-8 border-b border-[#D9DBE9] relative">

            {/* 체크박스 영역 */}
            <div className="flex items-center justify-center w-4 h-4">
                <input
                    type="checkbox"
                    id="selectAllCheckbox"
                    checked={isAllSelected}
                    onChange={onToggleAll}
                    className="w-4 h-4 rounded-[2px] bg-[#007AFF] border border-[#007AFF] text-[#007AFF] focus:ring-0 cursor-pointer appearance-none checked:bg-[url('https://upload.wikimedia.org/wikipedia/commons/2/27/White_check.svg')] checked:bg-no-repeat checked:bg-center checked:bg-[length:10px_10px]"
                />
            </div>

            {/* 선택 개수 표시 */}
            <div className="ml-8 flex items-center">
                <span className="font-['Pretendard_Variable'] font-bold text-[16px] leading-6 text-[#4E4B66]">
                    {selectedCount}개 선택
                </span>
            </div>

            {/* 상태 수정 버튼 및 팝업 영역 */}
            <div className="ml-auto relative">
                <button
                    onClick={togglePopup}
                    className="flex items-center justify-between w-[104px] h-8 rounded-[20px] px-3 gap-1 hover:bg-slate-200 transition-colors cursor-pointer relative z-10"
                >
                    <span className="font-['Pretendard_Variable'] font-medium text-[16px] leading-6 text-[#4E4B66] whitespace-nowrap">
                        상태 수정
                    </span>
                    <div className="flex items-center justify-center w-4 h-4">
                        <svg width="8" height="4" viewBox="0 0 8 4" fill="none" className="text-[#4E4B66]">
                            <path d="M1 1L4 3L7 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </button>

                {/* 팝업창 렌더링 */}
                {isPopupOpen && (
                    <>
                        {/* 바깥 클릭 시 닫히도록 하는 배경막 */}
                        <div className="fixed inset-0 z-40" onClick={closePopup} />

                        {/* 상태 수정 팝업창: 버튼 아래 우측 정렬 */}
                        <div
                            id="statusUpdatePopup"
                            className="absolute top-[40px] right-0 w-[240px] bg-[#D9DBE9] rounded-[16px] border border-[#D9DBE9] shadow-[0_0_8px_0_rgba(20,20,43,0.04)] z-50 overflow-hidden flex flex-col gap-[1px]"
                        >
                            {/* 팝업 헤더 */}
                            <div className="w-full h-8 px-4 py-2 bg-[#F7F7FC] flex items-center">
                                <span className="text-[12px] font-medium text-[#4E4B66]">상태 변경</span>
                            </div>

                            {/* 3. 옵션 리스트 맵핑 (FilterBar와 동일 아키텍처) */}
                            <div className="flex flex-col gap-[1px]">
                                {statusActions.map((actionName) => {
                                    // 4. 선택 여부 판단
                                    const isSelected = selectedAction === actionName;

                                    return (
                                        <button
                                            key={actionName}
                                            className="w-full h-[44px] px-4 py-2 bg-[#FEFEFE] hover:bg-[#F7F7FC] flex items-center justify-between transition-colors cursor-pointer"
                                            onClick={() => {
                                                // 5. 클릭 시 일시적으로 선택 상태 업데이트 후 동작 실행
                                                setSelectedAction(actionName);
                                                console.log(`${actionName} 실행 (대상 이슈 ID: 추후 Props로 수신)`);
                                                // 동작 완료 후 닫힘 (실제 API 연동 시에는 비동기 처리 완료 후 닫도록 설계)
                                                setTimeout(closePopup, 100);
                                            }}
                                        >
                                            {/* 6. 선택 상태에 따른 폰트 볼드 처리 */}
                                            <span className={`text-[16px] font-['Pretendard_Variable'] text-[#14142B] ${isSelected ? 'font-bold' : 'font-medium'}`}>
                                                {actionName}
                                            </span>

                                            {/* 7. FilterBar에서 복사해온 항상 표시되는 원형 아이콘 (isSelected 시 체크 표시) */}
                                            <svg
                                                className="w-4 h-4 text-[#4E4B66]"
                                                viewBox="0 0 16 16"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <circle cx="8" cy="8" r="7.2" stroke="currentColor" strokeWidth="1.6"/>
                                                {isSelected && (
                                                    <path
                                                        d="M5.33 8.33L7.33 10.33L10.67 6.67"
                                                        stroke="currentColor"
                                                        strokeWidth="1.6"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
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
        </div>
    );
}