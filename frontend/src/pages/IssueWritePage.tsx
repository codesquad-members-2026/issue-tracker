// src/pages/IssueWritePage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ListFilterDropdown from "../components/ListFilterDropdown.tsx";

// 데이터 타입 정의
interface Member { id: number; name: string; }
interface Label { id: number; name: string; backgroundColor: string; }
interface Milestone { id: number; name: string; }

export default function IssueWritePage() {
    const navigate = useNavigate();

    // 입력값 상태
    const [title, setTitle] = useState("");
    const [contents, setContents] = useState("");

    // 서버 데이터 상태
    const [allMembers, setAllMembers] = useState<Member[]>([]);
    const [allLabels, setAllLabels] = useState<Label[]>([]);
    const [allMilestones, setAllMilestones] = useState<Milestone[]>([]);

    // 사용자가 선택한 아이템 상태
    const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);
    const [selectedLabelIds, setSelectedLabelIds] = useState<number[]>([]);
    const [selectedMilestoneId, setSelectedMilestoneId] = useState<number | null>(null);

    // 페이지 로드 시 실제 DB 데이터 호출
    useEffect(() => {
        const fetchAllMetadata = async () => {
            try {
                const [mRes, lRes, miRes] = await Promise.all([
                    fetch("/api/members"),
                    fetch("/api/labels"),
                    fetch("/api/milestones")
                ]);

                const mResult = await mRes.json();
                const lResult = await lRes.json();
                const miResult = await miRes.json();

                if (mResult.success) setAllMembers(mResult.data);
                if (lResult.success) setAllLabels(lResult.data.labels);
                if (miResult.success) setAllMilestones(miResult.data);
            } catch (error) {
                console.error("데이터 로딩 실패:", error);
            }
        };
        void fetchAllMetadata();
    }, []);

    // 선택 토글 로직
    const toggleMember = (id: number) => {
        setSelectedMemberIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };
    const toggleLabel = (id: number) => {
        setSelectedLabelIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleSubmit = async () => {
        try {
            const issueData = {
                title: title.trim(),
                contents: contents.trim(),
                authorId: 1,
                assigneeIds: selectedMemberIds,
                labelIds: selectedLabelIds,
                milestoneId: selectedMilestoneId
            };

            const formData = new FormData();
            const requestBlob = new Blob([JSON.stringify(issueData)], { type: 'application/json' });
            formData.append('request', requestBlob);

            const response = await fetch("/api/issues", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (response.ok && result.success) {
                navigate("/");
            } else {
                alert("이슈 저장에 실패했습니다: " + result.message);
            }
        } catch (error) {
            console.error("이슈 저장 중 오류 발생:", error);
            alert("서버와 통신 중 오류가 발생했습니다.");
        }
    };

    // 공통 체크 아이콘
    const CheckIcon = ({ isSelected }: { isSelected: boolean }) => (
        <svg className="w-4 h-4 text-[#4E4B66]" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7.2" stroke="currentColor" strokeWidth="1.6"/>
            {isSelected && (
                <path d="M5.33 8.33L7.33 10.33L10.67 6.67" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            )}
        </svg>
    );

    return (
        <main className="max-w-[1440px] mx-auto px-6 py-10">
            <h1 className="text-3xl font-bold mb-8">새로운 이슈 작성</h1>

            <div className="flex gap-8">
                {/* 왼쪽: 에디터 영역 */}
                <div className="flex-grow flex flex-col gap-4">
                    <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                        <input
                            type="text"
                            placeholder="제목"
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF] mb-4"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <div className="relative">
                            <textarea
                                placeholder="코멘트를 입력하세요"
                                className="w-full h-96 p-4 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF] resize-none"
                                value={contents}
                                onChange={(e) => setContents(e.target.value)}
                            />
                            <div className="absolute bottom-4 right-4 text-sm text-slate-400">
                                띄어쓰기 포함 {contents.length}자
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end items-center gap-2 mt-4">
                        <button onClick={() => navigate(-1)} className="px-6 py-3 bg-slate-500 text-white rounded-xl font-bold hover:bg-slate-600 transition-colors">
                            취소
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!title.trim() || !contents.trim()}
                            className="px-6 py-3 bg-[#007AFF] text-white rounded-xl font-bold disabled:opacity-50 hover:bg-[#0062CC] transition-colors"
                        >
                            완료
                        </button>
                    </div>
                </div>

                {/* 💡 [사이드바 수정] 팝업이 짤리지 않도록 overflow-hidden을 제거했습니다. */}
                <div className="w-80 flex flex-col h-fit bg-white border border-slate-200 rounded-xl shadow-sm">

                    {/* [A] 담당자 섹션 */}
                    <div className="p-6 border-b border-slate-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-bold text-slate-500">담당자</h3>
                            <ListFilterDropdown title={""}>
                                <div className="flex flex-col w-full bg-[#D9DBE9] gap-[1px] rounded-[16px] overflow-hidden shadow-lg">
                                    <div className="px-4 py-2 bg-[#F7F7FC] text-[12px] font-medium text-[#4E4B66]">담당자 설정</div>
                                    {allMembers.map(member => (
                                        <button
                                            key={member.id}
                                            onClick={() => toggleMember(member.id)}
                                            className="w-full h-[44px] px-4 py-2 bg-[#FEFEFE] hover:bg-[#F7F7FC] flex items-center justify-between transition-colors"
                                        >
                                            <span className={`text-[16px] text-[#14142B] ${selectedMemberIds.includes(member.id) ? 'font-bold' : 'font-medium'}`}>{member.name}</span>
                                            <CheckIcon isSelected={selectedMemberIds.includes(member.id)} />
                                        </button>
                                    ))}
                                </div>
                            </ListFilterDropdown>
                        </div>
                        <div className="flex flex-col gap-2">
                            {selectedMemberIds.length === 0 ? <span className="text-sm text-slate-400">선택된 담당자 없음</span> :
                                allMembers.filter(m => selectedMemberIds.includes(m.id)).map(member => (
                                    <span key={member.id} className="text-sm font-medium text-[#4E4B66] py-1">
                                        {member.name}
                                    </span>
                                ))}
                        </div>
                    </div>

                    {/* [B] 레이블 섹션 */}
                    <div className="p-6 border-b border-slate-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-bold text-slate-500">레이블</h3>
                            <ListFilterDropdown title={""}>
                                <div className="flex flex-col w-full bg-[#D9DBE9] gap-[1px] rounded-[16px] overflow-hidden shadow-lg">
                                    <div className="px-4 py-2 bg-[#F7F7FC] text-[12px] font-medium text-[#4E4B66]">레이블 설정</div>
                                    {allLabels.map(label => (
                                        <button
                                            key={label.id}
                                            onClick={() => toggleLabel(label.id)}
                                            className="w-full h-[44px] px-4 py-2 bg-[#FEFEFE] hover:bg-[#F7F7FC] flex items-center justify-between transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full" style={{backgroundColor: label.backgroundColor}} />
                                                <span className={`text-[16px] text-[#14142B] ${selectedLabelIds.includes(label.id) ? 'font-bold' : 'font-medium'}`}>{label.name}</span>
                                            </div>
                                            <CheckIcon isSelected={selectedLabelIds.includes(label.id)} />
                                        </button>
                                    ))}
                                </div>
                            </ListFilterDropdown>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {selectedLabelIds.length === 0 ? <span className="text-sm text-slate-400">선택된 레이블 없음</span> :
                                allLabels.filter(l => selectedLabelIds.includes(l.id)).map(l => (
                                    <span key={l.id} className="px-3 py-1 rounded-full text-xs text-white font-bold" style={{backgroundColor: l.backgroundColor}}>{l.name}</span>
                                ))}
                        </div>
                    </div>

                    {/* [C] 마일스톤 섹션 */}
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-bold text-slate-500">마일스톤</h3>
                            <ListFilterDropdown title={""}>
                                <div className="flex flex-col w-full bg-[#D9DBE9] gap-[1px] rounded-[16px] overflow-hidden shadow-lg">
                                    <div className="px-4 py-2 bg-[#F7F7FC] text-[12px] font-medium text-[#4E4B66]">마일스톤 설정</div>
                                    {allMilestones.map(ms => (
                                        <button
                                            key={ms.id}
                                            onClick={() => setSelectedMilestoneId(selectedMilestoneId === ms.id ? null : ms.id)}
                                            className="w-full h-[44px] px-4 py-2 bg-[#FEFEFE] hover:bg-[#F7F7FC] flex items-center justify-between transition-colors"
                                        >
                                            <span className={`text-[16px] text-[#14142B] ${selectedMilestoneId === ms.id ? 'font-bold' : 'font-medium'}`}>{ms.name}</span>
                                            <CheckIcon isSelected={selectedMilestoneId === ms.id} />
                                        </button>
                                    ))}
                                </div>
                            </ListFilterDropdown>
                        </div>
                        <div className="text-sm text-slate-600 font-medium">
                            {selectedMilestoneId === null ? <span className="text-slate-400">선택된 마일스톤 없음</span> :
                                allMilestones.find(m => m.id === selectedMilestoneId)?.name}
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}