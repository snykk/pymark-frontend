// RegisFileSharingResponse.ts
import type BaseApiResponse from "~/types/BaseApiResponse";

export interface RegisData {
    user?: {
        id: number;
        email: string;
        password: string;
    };
}

export default interface RegisFileSharingResponse extends BaseApiResponse<RegisData | null> {}
