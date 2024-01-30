import type FileInfo from "~/types/FileInfo";
import type BaseApiResponse from "~/types/BaseApiResponse";

interface ImageProcessingData {
    folder_result: number;
    uploaded_file_responses: {
        original_image: FileInfo;
        attacked_image: FileInfo;
    };
}

// export type ImageProcessingApiResponse = BaseApiResponse<ImageProcessingData>;
export default interface ImageProcessingApiResponse extends BaseApiResponse<ImageProcessingData> {}
