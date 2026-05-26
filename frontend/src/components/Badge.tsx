// src/components/Badge.tsx
import { getContrastColor } from "../utils/color";

interface BadgeProps {
    text: string;
    backgroundColor: string;
    textColor?: string;
}

export default function Badge({ text, backgroundColor, textColor }: BadgeProps) {
    const autoTextColor = getContrastColor(backgroundColor);
    const finalTextColor = 
        textColor === "#FEFEFE" || textColor === "white" || textColor === "light" ? "white" : 
        textColor === "#14142B" || textColor === "black" || textColor === "dark" ? "black" : 
        autoTextColor;
    
    return (
        <span 
            className="inline-flex items-center px-4 py-1 rounded-full text-xs font-bold"
            style={{ 
                backgroundColor: backgroundColor,
                color: finalTextColor === "black" ? "#14142B" : "#FEFEFE"
            }}
        >
            {text}
        </span>
    );
}
