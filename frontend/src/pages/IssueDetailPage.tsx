import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CommentItem from "../components/CommentItem.tsx";
import CommentInput from "../components/CommentInput.tsx";
import IssueDetailHeader from "../components/IssueDetailHeader.tsx";
import IssueDetailSidebar from "../components/IssueDetailSidebar.tsx";
import type { IssueDetail, IssueDetailResponse, Comment, User, Label, Milestone } from "../types/Issue";

export default function IssueDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [issue, setIssue] = useState<IssueDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 제목 편집 상태
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState("");

    // 서버 데이터 상태 (사이드바 드롭다운용)
    const [allMembers, setAllMembers] = useState<User[]>([]);
    const [allLabels, setAllLabels] = useState<Label[]>([]);
    const [allMilestones, setAllMilestones] = useState<Milestone[]>([]);

    useEffect(() => {
        const fetchIssueDetail = async () => {
            try {
                const response = await fetch(`/api/issues/${id}`);
                const result: IssueDetailResponse = await response.json();

                if (result.success) {
                    setIssue(result.data);
                    setEditedTitle(result.data.title);
                } else {
                    alert(result.message);
                    navigate("/");
                }
            } catch (error) {
                console.error("이슈 상세 정보를 불러오는데 실패했습니다.", error);
                alert("데이터 로딩 중 오류가 발생했습니다.");
                navigate("/");
            } finally {
                setIsLoading(false);
            }
        };

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

        void fetchIssueDetail();
        void fetchAllMetadata();
    }, [id, navigate]);

    const handleToggleStatus = async () => {
        if (!issue) return;
        const newStatus = issue.isOpened ? "CLOSED" : "OPEN";
        const confirmMessage = issue.isOpened 
            ? "이슈를 닫으시겠습니까?" 
            : "이슈를 다시 여시겠습니까?";
        
        if (!window.confirm(confirmMessage)) return;

        try {
            const response = await fetch(`/api/issues/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status: newStatus })
            });
            const result = await response.json();

            if (result.success) {
                setIssue(prev => prev ? { ...prev, isOpened: !prev.isOpened } : null);
            } else {
                alert("상태 변경 실패: " + result.message);
            }
        } catch (error) {
            console.error("이슈 상태 변경 중 오류 발생:", error);
            alert("처리 중 오류가 발생했습니다.");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("정말로 이 이슈를 삭제하시겠습니까?")) return;

        try {
            const response = await fetch(`/api/issues/${id}`, {
                method: "DELETE"
            });
            const result = await response.json();

            if (result.success) {
                navigate("/");
            } else {
                alert("이슈 삭제 실패: " + result.message);
            }
        } catch (error) {
            console.error("이슈 삭제 중 오류 발생:", error);
            alert("삭제 처리 중 오류가 발생했습니다.");
        }
    };

    const handleTitleUpdate = async () => {
        if (!issue || !editedTitle.trim() || editedTitle === issue.title) {
            setIsEditingTitle(false);
            return;
        }

        try {
            const response = await fetch(`/api/issues/${id}/title`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ title: editedTitle })
            });
            const result = await response.json();

            if (result.success) {
                setIssue(prev => prev ? { ...prev, title: editedTitle } : null);
                setIsEditingTitle(false);
            } else {
                alert("제목 수정 실패: " + result.message);
            }
        } catch (error) {
            console.error("제목 수정 중 오류 발생:", error);
            alert("처리 중 오류가 발생했습니다.");
        }
    };

    const handleContentsUpdate = async (_id: number, contents: string) => {
        if (!issue || contents === issue.contents) {
            return;
        }

        try {
            const response = await fetch(`/api/issues/${id}/contents`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ contents: contents })
            });
            const result = await response.json();

            if (result.success) {
                setIssue(prev => prev ? { ...prev, contents: contents } : null);
            } else {
                alert("본문 수정 실패: " + result.message);
            }
        } catch (error) {
            console.error("본문 수정 중 오류 발생:", error);
            alert("처리 중 오류가 발생했습니다.");
        }
    };

    const handleCommentUpdate = async (commentId: number, contents: string) => {
        try {
            const response = await fetch(`/api/issues/${id}/comments/${commentId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ contents })
            });
            const result = await response.json();

            if (result.success) {
                setIssue(prev => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        comments: prev.comments.map(c => 
                            c.id === commentId ? { ...c, contents } : c
                        )
                    };
                });
            } else {
                alert("댓글 수정 실패: " + result.message);
            }
        } catch (error) {
            console.error("댓글 수정 중 오류 발생:", error);
            alert("처리 중 오류가 발생했습니다.");
        }
    };

    const handleCommentSubmit = async (contents: string) => {
        try {
            const response = await fetch(`/api/issues/${id}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ contents })
            });
            const result = await response.json();

            if (result.success) {
                const newComment: Comment = result.data;
                setIssue(prev => prev ? {
                    ...prev,
                    comments: [...prev.comments, newComment],
                    commentCount: prev.commentCount + 1
                } : null);
            } else {
                alert("댓글 작성 실패: " + result.message);
            }
        } catch (error) {
            console.error("댓글 작성 중 오류 발생:", error);
            alert("처리 중 오류가 발생했습니다.");
        }
    };

    const handleAssigneesUpdate = async (assigneeIds: number[]) => {
        try {
            const response = await fetch(`/api/issues/${id}/assignees`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ assigneeIds })
            });
            const result = await response.json();
            if (result.success) {
                const updatedAssignees = allMembers.filter(m => assigneeIds.includes(m.id));
                setIssue(prev => prev ? { ...prev, assignees: updatedAssignees } : null);
            } else {
                alert("담당자 수정 실패: " + result.message);
            }
        } catch (error) {
            console.error("담당자 수정 중 오류 발생:", error);
        }
    };

    const handleLabelsUpdate = async (labelIds: number[]) => {
        try {
            const response = await fetch(`/api/issues/${id}/labels`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ labelIds })
            });
            const result = await response.json();
            if (result.success) {
                const updatedLabels = allLabels.filter(l => labelIds.includes(l.id));
                setIssue(prev => prev ? { ...prev, labels: updatedLabels } : null);
            } else {
                alert("레이블 수정 실패: " + result.message);
            }
        } catch (error) {
            console.error("레이블 수정 중 오류 발생:", error);
        }
    };

    const handleMilestoneUpdate = async (milestoneId: number | null) => {
        try {
            const response = await fetch(`/api/issues/${id}/milestone`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ milestoneId })
            });
            const result = await response.json();
            if (result.success) {
                const updatedMilestone = allMilestones.find(m => m.id === milestoneId) || null;
                setIssue(prev => prev ? { ...prev, milestone: updatedMilestone } : null);
            } else {
                alert("마일스톤 수정 실패: " + result.message);
            }
        } catch (error) {
            console.error("마일스톤 수정 중 오류 발생:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-64px)]">
                <span className="text-slate-400">이슈 정보를 불러오는 중입니다...</span>
            </div>
        );
    }

    if (!issue) return null;

    return (
        <main className="max-w-[1440px] mx-auto px-6 py-10">
            <IssueDetailHeader
                issue={issue}
                isEditingTitle={isEditingTitle}
                editedTitle={editedTitle}
                onEditClick={() => setIsEditingTitle(true)}
                onCancelEdit={() => {
                    setIsEditingTitle(false);
                    setEditedTitle(issue.title);
                }}
                onTitleChange={setEditedTitle}
                onTitleSave={handleTitleUpdate}
                onToggleStatus={handleToggleStatus}
            />

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left: Comment Stream */}
                <div className="flex-grow relative">
                    {/* Vertical line connecting comments */}
                    <div className="absolute left-[22px] top-11 bottom-0 w-[1px] bg-slate-200 -z-10" />

                    {/* Issue Body (Initial Comment) */}
                    <CommentItem
                        isMainContent={true}
                        comment={{
                            id: 0,
                            author: issue.author,
                            contents: issue.contents,
                            createdAt: issue.createdAt,
                            isIssueAuthor: true
                        }}
                        onSaveEdit={handleContentsUpdate}
                    />
                    
                    <div className="flex flex-col">
                        {issue.comments.map(comment => (
                            <CommentItem 
                                key={comment.id} 
                                comment={comment} 
                                onSaveEdit={handleCommentUpdate}
                            />
                        ))}
                    </div>

                    <CommentInput onSubmit={handleCommentSubmit} />
                </div>

                {/* Right: Sidebar */}
                <IssueDetailSidebar
                    issue={issue}
                    allMembers={allMembers}
                    allLabels={allLabels}
                    allMilestones={allMilestones}
                    onDelete={handleDelete}
                    onAssigneesUpdate={handleAssigneesUpdate}
                    onLabelsUpdate={handleLabelsUpdate}
                    onMilestoneUpdate={handleMilestoneUpdate}
                />
            </div>
        </main>
    );
}
