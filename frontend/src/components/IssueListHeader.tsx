// src/components/IssueListHeader.tsx
import ListFilterDropdown from "./ListFilterDropdown.tsx";
import AssigneeFilterContent from "./filter/AssigneeFilterContent.tsx";

// 부모(IssueListPage)로부터 받을 상태와 함수 타입 정의
interface IssueListHeaderProps {
    isAllSelected: boolean;
    onToggleAll: () => void;
}

export default function IssueListHeader({ isAllSelected, onToggleAll }: IssueListHeaderProps) {

  return (
    // 1. 전체 컨테이너 (List Header)
    <div className="flex items-center w-full h-[64px] bg-[#F7F7FC] rounded-t-[16px] px-8 border-b border-slate-200 gap-6">

      {/* 2. 체크박스 */}
      <input
        type="checkbox"
        id="headerSelecAllCheckbox"
        checked={isAllSelected}
        onChange={onToggleAll}
        className="w-4 h-4 rounded-[2px] border-[1.6px] border-[#D9DBE9] text-blue-600 focus:ring-0 cursor-pointer"
      />

        {/* 2. 탭 영역 (체크박스와 32px(ml-8) 정도 떨어져 있다고 가정하여 여백 추가) */}
        <div className="flex items-center gap-6 ml-8">

            {/* [A] 열린 이슈 (선택된 상태 - Active) */}
            <button className="flex items-center gap-1 cursor-pointer">
                {/* alertCircle 아이콘 */}
                <svg className="w-4 h-4 text-[#14142B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2"></circle>
                    <path d="M12 8v4m0 4h.01" strokeWidth="2" strokeLinecap="round"></path>
                </svg>
                <span className="font-['Pretendard'] text-[16px] font-bold text-[#14142B]">
            열린 이슈(2)
          </span>
            </button>

            {/* [B] 닫힌 이슈 (기본 상태 - Enabled) */}
            <button className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity">
                {/* archive 아이콘 */}
                <svg className="w-4 h-4 text-[#4E4B66]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                </svg>
                <span className="font-['Pretendard'] text-[16px] font-medium text-[#4E4B66]">
            닫힌 이슈(0)
          </span>
            </button>
        </div>

        {/* 🔵 [우측 영역]: 드롭다운 필터들 */}
        <div className="flex items-center gap-8 ml-auto">
            <ListFilterDropdown title="담당자">
                <AssigneeFilterContent />
            </ListFilterDropdown>

            <ListFilterDropdown title="담당자">
                {/*레이블*/}
            </ListFilterDropdown>

            <ListFilterDropdown title="담당자">
                {/*마일스톤*/}
            </ListFilterDropdown>

            <ListFilterDropdown title="담당자">
                {/*작성자*/}
            </ListFilterDropdown>
        </div>
    </div>
  );
}