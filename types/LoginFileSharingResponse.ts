export default interface LoginFileSharingResponse {
    status: boolean;
    message: string;
    data?: {
        access_token?: string;
        user?: {
            id: number;
            username: string;
            email: string;
        };
    };
}
