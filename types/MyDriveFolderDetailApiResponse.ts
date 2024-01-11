interface FileLinks {
    download_link: string;
    web_view_link: string;
}

interface File {
    id: string;
    links: FileLinks;
    name: string;
}

export interface MyDriveFolderDetailApiResponse {
    data: {
        files: File[];
        folder_id: string;
    };
    message: string;
    status: boolean;
}
