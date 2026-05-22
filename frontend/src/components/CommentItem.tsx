import { useState } from "react";
import type { Comment as CommentType } from "../types/Issue";
import { getRelativeTime } from "../utils/date";

interface CommentItemProps {
    comment: CommentType;
    isMainContent?: boolean;
    onSaveEdit?: (id: number, contents: string) => Promise<void>;
}

export default function CommentItem({
    comment,
    isMainContent = false,
    onSaveEdit
}: CommentItemProps) {
    const { id, author, contents, createdAt, isIssueAuthor } = comment;
    const [isEditing, setIsEditing] = useState(false);
    const [editedContents, setEditedContents] = useState(contents);

    const handleSave = async () => {
        if (!onSaveEdit || editedContents === contents) {
            setIsEditing(false);
            return;
        }
        await onSaveEdit(id, editedContents);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedContents(contents);
        setIsEditing(false);
    };

    return (
        <div className={`flex gap-4 mb-8 ${isMainContent ? 'relative' : ''}`}>
            {/* User Avatar */}
            <img
                src={`https://avatars.githubusercontent.com/${author.name}?s=44&v=4`}
                alt={`${author.name}'s profile`}
                className="w-11 h-11 rounded-full border border-slate-200 object-cover"
                onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
                }}
            />

            {/* Comment Box */}
            <div className={`flex-grow border rounded-xl overflow-hidden shadow-sm bg-white ${isMainContent ? 'border-[#007AFF]' : 'border-slate-200'} ${isEditing ? 'ring-1 ring-[#007AFF]' : ''}`}>
                {/* Header */}
                <div className={`flex justify-between items-center px-6 py-3 border-b ${isMainContent ? 'bg-[#EFF7FF] border-[#007AFF]/20' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-700">{author.name}</span>
                        <span className="text-slate-400 text-sm">{getRelativeTime(createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            {isIssueAuthor && (
                                <div className="px-2 py-0.5 border border-slate-200 rounded-full text-[10px] font-bold text-slate-500 uppercase">
                                    Author
                                </div>
                            )}
                            {isMainContent && (
                                <div className="px-2 py-0.5 bg-[#007AFF] rounded-full text-[10px] font-bold text-white uppercase">
                                    Initial Post
                                </div>
                            )}
                        </div>

                        {!isEditing && onSaveEdit && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-1 text-slate-400 hover:text-[#007AFF] transition-colors"
                            >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                                </svg>
                                <span className="text-xs font-bold">편집</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-6">
                    {isEditing ? (
                        <div className="flex flex-col gap-4">
                            <textarea
                                value={editedContents}
                                onChange={(e) => setEditedContents(e.target.value)}
                                className="w-full min-h-[200px] p-4 bg-slate-50 border border-slate-200 rounded-lg text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 transition-all resize-none"
                                placeholder="코멘트를 입력하세요"
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    편집 취소
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={!isMainContent && !editedContents.trim()}
                                    className="px-4 py-2 text-sm font-bold text-white bg-[#007AFF] hover:bg-[#0062CC] disabled:bg-slate-300 rounded-lg transition-colors"
                                >
                                    편집 완료
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className={`leading-relaxed whitespace-pre-wrap ${isMainContent ? 'text-lg' : 'text-base'} ${!contents ? 'text-slate-400 italic' : 'text-[#4E4B66]'}`}>
                            {contents || "No description provided."}
                        </div>
                    )}
                </div>
            </div>
            
            {/* Vertical Line for stream effect - only if not main content or if you want to connect them */}
            {!isMainContent && (
                <div className="absolute left-[22px] -top-8 w-[1px] h-8 bg-slate-200 -z-10" />
            )}
        </div>
    );
}