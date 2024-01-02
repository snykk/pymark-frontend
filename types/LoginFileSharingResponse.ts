export default interface LoginFileSharingResponse {
    status: boolean;
    message: string;
    data?: {
        access_token?: string;
    };
}
