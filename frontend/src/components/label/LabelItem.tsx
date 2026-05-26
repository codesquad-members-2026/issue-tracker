// src/components/LabelItem.tsx
import Badge from "../Badge.tsx";
import LabelDescription from "./LabelDescription.tsx";
import ActionButtons from "./ActionButtons.tsx";

interface Label {
    id: number;
    name: string;
    description: string;
    textColor: string;
    backgroundColor: string;
}

interface LabelItemProps {
    label: Label;
    onEdit: () => void;
    onDelete: () => void;
}

export default function LabelItem({ label, onEdit, onDelete }: LabelItemProps) {
    return (
        <div className="flex items-center justify-between px-8 py-6 bg-white border-t border-slate-200 first:border-t-0 hover:bg-slate-50 transition-colors">
            {/* Badge 영역 */}
            <div className="w-1/4">
                <Badge text={label.name} backgroundColor={label.backgroundColor} textColor={label.textColor} />
            </div>
            
            {/* LabelDescription 영역 */}
            <div className="flex-grow">
                <LabelDescription description={label.description} />
            </div>
            
            {/* ActionButtons 영역 */}
            <div className="w-1/4 flex justify-end">
                <ActionButtons onEdit={onEdit} onDelete={onDelete} />
            </div>
        </div>
    );
}
