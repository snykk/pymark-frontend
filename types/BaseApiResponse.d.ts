interface BaseApiResponse<T> {
    data: T;
    message: string;
    status: boolean;
}
