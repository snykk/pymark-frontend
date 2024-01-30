// RobustnessApiResponse.ts
import type BaseApiResponse from "~/types/BaseApiResponse";

export interface RobustnessData {
    robustness_analysis: {
        ber: number; // Bit Error Rate
        ncc: number; // Normalized Cross-Correlation
    };
}

export default interface RobustnessApiResponse extends BaseApiResponse<RobustnessData> {}
