import type FileInfo from "~/types/FileInfo";
import type BaseApiResponse from "~/types/BaseApiResponse";

interface ExtractionData {
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

// export type ExtractionApiResponse = BaseApiResponse<ExtractionData>;
export default interface ExtractionApiResponse extends BaseApiResponse<ExtractionData> {}
