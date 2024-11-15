interface Folder {
    id: string;
    name: string;
}

interface MyDriveFoldersData {
    pymark_featur: string;
    watermarking_folders: Folder[];
}

interface MyDriveFoldersApiResponse extends BaseApiResponse<MyDriveFoldersData> {}
