export default interface RegisFileSharingResponse {
    status: boolean;
    message: string;
    data?: {
        user?: {
            id: number;
            email: string;
            password: string;
        };
    };
}
