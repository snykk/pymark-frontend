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

interface EmbeddingApiResponse extends BaseApiResponse<EmbeddingData> {}
