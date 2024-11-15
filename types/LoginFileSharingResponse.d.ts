interface LoginData {
    access_token?: string;
    user?: {
        id: number;
        username: string;
        email: string;
    };
}

interface LoginFileSharingResponse extends BaseApiResponse<LoginData | null> {}
