interface ExtractionData {
    folder_id: string;
    folder_result: number;
    robustness_analysis: {
        ber: number;
        ncc: number;
    };
    uploaded_file_responses: {
        block_position: FileInfo;
        embedding_result_zip: FileInfo;
        extracted_watermark: FileInfo;
        key_matrix: FileInfo;
        watermarked_image: FileInfo;
    };
}

interface ExtractionApiResponse extends BaseApiResponse<ExtractionData> {}
