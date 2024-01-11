export interface ImperceptibilityApiResponse {
    data: {
        imperceptibility_analysis: {
            psnr: number;
            ssim: number;
        };
    };
    message: string;
    status: boolean;
}
