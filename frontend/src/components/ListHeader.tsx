// src/components/ListHeader.tsx
import type { ReactNode } from "react";

interface ListHeaderProps {
    children: ReactNode;
}

export default function ListHeader({ children }: ListHeaderProps) {
    return (
        <div className="px-8 py-4 bg-slate-50 border-b border-slate-200">
            {children}
        </div>
    );
}
