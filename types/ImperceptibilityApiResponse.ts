import type BaseApiResponse from "~/types/BaseApiResponse";

interface ImperceptibilityData {
    imperceptibility_analysis: {
        psnr: number;
        ssim: number;
    };
}

// export type ImperceptibilityApiResponse = BaseApiResponse<ImperceptibilityData>;
export default interface ImperceptibilityApiResponse extends BaseApiResponse<ImperceptibilityData> {}
