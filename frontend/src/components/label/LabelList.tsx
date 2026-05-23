// src/components/LabelList.tsx
import type { ReactNode } from "react";
import ListContainer from "../ListContainer.tsx";
import ListHeader from "../ListHeader.tsx";

interface LabelListProps {
    labelCount: number;
    children: ReactNode;
}

export default function LabelList({ labelCount, children }: LabelListProps) {
    return (
        <ListContainer>
            <ListHeader>
                <h2 className="text-sm font-bold text-[#4E4B66]">
                    {labelCount}개의 레이블
                </h2>
            </ListHeader>
            <div className="flex flex-col">
                {children}
            </div>
        </ListContainer>
    );
}
