interface RobustnessData {
    robustness_analysis: {
        ber: number; // Bit Error Rate
        ncc: number; // Normalized Cross-Correlation
    };
}

interface RobustnessApiResponse extends BaseApiResponse<RobustnessData> {}
