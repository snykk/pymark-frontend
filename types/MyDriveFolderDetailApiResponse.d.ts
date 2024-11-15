interface FileLinks {
    download_link: string;
    web_view_link: string;
    thumbnail_link: string;
}

interface File {
    id: string;
    links: FileLinks;
    name: string;
}

interface MyDriveFolderDetailData {
    files: File[];
    folder_id: string;
}

interface MyDriveFolderDetailApiResponse extends BaseApiResponse<MyDriveFolderDetailData> {}
