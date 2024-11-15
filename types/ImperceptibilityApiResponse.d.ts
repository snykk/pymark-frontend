interface ImperceptibilityData {
    imperceptibility_analysis: {
        psnr: number;
        ssim: number;
    };
}

interface ImperceptibilityApiResponse extends BaseApiResponse<ImperceptibilityData> {}
