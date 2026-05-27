export const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:8080/api/images/upload", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error("이미지 업로드에 실패했습니다.");
    }

    const result = await response.json();
    return result.imageUrl;
};
