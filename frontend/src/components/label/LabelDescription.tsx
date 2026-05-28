// src/components/LabelDescription.tsx

interface LabelDescriptionProps {
    description?: string;
}

export default function LabelDescription({ description }: LabelDescriptionProps) {
    return (
        <p className="text-sm text-slate-500 truncate max-w-md">
            {description || "설명이 없습니다."}
        </p>
    );
}
