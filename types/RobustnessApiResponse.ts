export interface RobustnessApiResponse {
    status: boolean;
    message: string;
    data: {
        robustness_analysis: {
            ber: number; // Bit Error Rate
            ncc: number; // Normalized Cross-Correlation
        };
    };
}
