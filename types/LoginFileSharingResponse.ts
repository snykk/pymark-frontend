import type BaseApiResponse from "~/types/BaseApiResponse";

interface LoginData {
    access_token?: string;
    user?: {
        id: number;
        username: string;
        email: string;
    };
}

// export type LoginFileSharingResponse = BaseApiResponse<LoginData | null>;
export default interface LoginFileSharingResponse extends BaseApiResponse<LoginData | null> {}
