import type FileInfo from "~/types/FileInfo";
import type BaseApiResponse from "~/types/BaseApiResponse";

interface EmbeddingData {
    folder_id: string;
    folder_result: number;
    imperceptibility_analysis: {
        psnr: number;
        ssim: number;
    };
    uploaded_file_responses: {
        block_position: FileInfo;
        embedding_result_zip: FileInfo;
        key_matrix: FileInfo;
        watermarked_image: FileInfo;
        public_compressed_image: FileInfo;
    };
}

// export type EmbeddingApiResponse = BaseApiResponse<EmbeddingData>;
export default interface EmbeddingApiResponse extends BaseApiResponse<EmbeddingData> {}
