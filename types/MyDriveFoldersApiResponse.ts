export interface MyDriveFoldersApiResponse {
    data: {
        pymark_featur: string;
        watermarking_folders: Folder[];
    };
    message: string;
    status: boolean;
}

interface Folder {
    id: string;
    name: string;
}
