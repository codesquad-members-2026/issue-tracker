// src/components/ListContainer.tsx
import type { ReactNode } from "react";

interface ListContainerProps {
    children: ReactNode;
}

export default function ListContainer({ children }: ListContainerProps) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            {children}
        </div>
    );
}
