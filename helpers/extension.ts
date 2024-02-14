function getFileExtension(filename: string): string {
    return filename.split(".").pop()?.toLowerCase() || "";
}

export function isImageFile(filename: string): boolean {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "tiff"]; // Add more image extensions as needed
    const extension = getFileExtension(filename);
    return imageExtensions.includes(extension);
}

export function isTextFile(filename: string): boolean {
    const extension = getFileExtension(filename);
    return extension === "txt";
}
