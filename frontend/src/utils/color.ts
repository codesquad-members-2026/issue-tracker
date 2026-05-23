// src/utils/color.ts

/**
 * HEX 색상을 입력받아 밝기를 계산하고 적절한 텍스트 색상 유형을 반환합니다.
 * @param hexColor #FFFFFF 형식의 색상 코드
 * @returns "white" | "black"
 */
export function getContrastColor(hexColor: string): "white" | "black" {
    if (!/^#[0-9A-F]{6}$/i.test(hexColor)) return "black";

    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Luminance 공식
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    return luminance > 0.5 ? "black" : "white";
}

/**
 * 전역 색상 상수
 */
export const COLORS = {
    BLUE: "#007AFF",
    RED: "#FF3B30",
    GRAY: "#D9DBE9",
    LIGHT_GRAY: "#F7F7FC",
    TEXT_DEFAULT: "#14142B",
    TEXT_SLATE: "#4E4B66",
};

/**
 * 랜덤한 HEX 색상 코드를 생성합니다.
 */
export function getRandomColor(): string {
    return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
}
