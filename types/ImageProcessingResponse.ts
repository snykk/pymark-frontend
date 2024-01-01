import type { FileInfo } from "~/types/FileInfo";

export interface ImageProcessingApiResponse {
    data: {
        folder_result: number;
        uploaded_file_responses: {
            original_image: FileInfo;
            attacked_image: FileInfo;
        };
    };
    message: string;
    status: boolean;
}
