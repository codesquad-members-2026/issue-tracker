import toast from 'react-hot-toast';
import { useRef } from 'react';
import { uploadImage } from '../utils/imageUpload';

export function useImageUpload(value: string, onChange: (val: string) => void) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const triggerUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const imageUrl = await uploadImage(file);
            const markdownImage = `\n![${file.name}](${imageUrl})\n`;
            onChange(value + markdownImage);
        } catch (error) {
            console.error("이미지 업로드 실패:", error);
            toast.error("이미지 업로드에 실패했습니다.");
        } finally {
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    return { triggerUpload, handleFileChange, fileInputRef };
}
