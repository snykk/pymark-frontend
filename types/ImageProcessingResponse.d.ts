interface ImageProcessingData {
    folder_id: string;
    folder_result: number;
    uploaded_file_responses: {
        original_image: FileInfo;
        attacked_image: FileInfo;
    };
}

interface ImageProcessingApiResponse extends BaseApiResponse<ImageProcessingData> {}
