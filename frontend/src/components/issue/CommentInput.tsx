import { useState } from "react";

interface CommentInputProps {
    onSubmit: (contents: string) => Promise<void>;
}

export default function CommentInput({ onSubmit }: CommentInputProps) {
    const [contents, setContents] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!contents.trim()) return;

        setIsSubmitting(true);
        try {
            await onSubmit(contents);
            setContents("");
        } catch (error) {
            console.error("댓글 작성 실패:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex gap-4 mb-8">
            {/* User Avatar */}
            <img
                src="https://avatars.githubusercontent.com/u/9919?s=44&v=4"
                alt="Current User"
                className="w-11 h-11 rounded-full border border-slate-200 object-cover"
            />

            {/* Input Box */}
            <div className="flex-grow flex flex-col border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white focus-within:border-[#007AFF] focus-within:ring-1 focus-within:ring-[#007AFF]/30 transition-all">
                {/* Header/Toolbar placeholder */}
                <div className="flex justify-between items-center px-4 py-2 border-b border-slate-100 bg-slate-50">
                    <span className="text-xs font-bold text-slate-400">코멘트 작성</span>
                </div>

                {/* Textarea */}
                <textarea
                    value={contents}
                    onChange={(e) => setContents(e.target.value)}
                    placeholder="코멘트를 입력하세요"
                    className="w-full h-32 px-4 py-4 resize-none outline-none text-[#4E4B66] placeholder:text-slate-400"
                    disabled={isSubmitting}
                />

                {/* Footer / Actions */}
                <div className="flex justify-between items-center px-4 py-3 border-t border-slate-100">
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                        <button className="flex items-center gap-1 hover:text-slate-700 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.414a4 4 0 00-5.656-5.656l-6.415 6.414a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                            파일 첨부
                        </button>
                    </div>
                    
                    <button
                        onClick={handleSubmit}
                        disabled={!contents.trim() || isSubmitting}
                        className={`px-4 py-2 rounded-lg text-sm font-bold text-white transition-all ${
                            !contents.trim() || isSubmitting
                            ? "bg-[#007AFF]/50 cursor-not-allowed"
                            : "bg-[#007AFF] hover:bg-[#0062CC] active:scale-95 shadow-md"
                        }`}
                    >
                        {isSubmitting ? "작성 중..." : "코멘트 작성"}
                    </button>
                </div>
            </div>
        </div>
    );
}
