interface RegisData {
    user?: {
        id: number;
        email: string;
        password: string;
    };
}

interface RegisFileSharingResponse extends BaseApiResponse<RegisData | null> {}
