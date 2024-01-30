// MyDriveFoldersApiResponse.ts
import type BaseApiResponse from "~/types/BaseApiResponse";

interface Folder {
    id: string;
    name: string;
}

export interface MyDriveFoldersData {
    pymark_featur: string;
    watermarking_folders: Folder[];
}

// export type MyDriveFoldersApiResponse = BaseApiResponse<MyDriveFoldersData>;
export default interface MyDriveFoldersApiResponse extends BaseApiResponse<MyDriveFoldersData> {}
