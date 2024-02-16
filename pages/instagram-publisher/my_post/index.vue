<template>
    <main>
        <!-- Content -->
        <div v-if="responseData?.status === true" class="max-w-full overflow-x-auto">
            <h2 class="text-xl font-extrabold mb-4">My Post Folder</h2>
            <table class="min-w-full text-start">
                <thead>
                    <tr>
                        <th colspan="2" class="py-2 text-left">Folder Name</th>
                        <th class="px-4 py-2 text-left">ID</th>
                        <th class="px-4 py-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="folder in responseData?.data.watermarking_folders" :key="folder.id" class="cursor-pointer border-b border-gray-200" @click="!isProcessing && navigateToFolder(folder.id)">
                        <td class="w-[35px]">
                            <img alt="Folder icon" src="~/assets/icon/folder2.svg" width="30" height="30" />
                        </td>
                        <td class="pr-4 py-2 flex">
                            {{ folder.name }}
                        </td>
                        <td class="px-4 py-2">{{ folder.id }}</td>
                        <td class="px-4 py-2">
                            <button @click.stop="confirmDeleteFolder(folder.id)" :disabled="isProcessing" :class="{ 'opacity-50 cursor-not-allowed': isProcessing }" class="text-red-600 hover:text-red-800">
                                {{ deletingFolderId === folder.id ? "Deleting..." : "Delete" }}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else-if="responseData?.status === false">
            <div class="mx-auto w-1/2" id="loading_no_data">
                <LoadingIndicator class="h-full w-full" :options="defaultOptionNoData" />
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import Swal from "sweetalert2";
import type MyDriveFoldersApiResponse from "~/types/MyDriveFoldersApiResponse";
import loadingNoData from "~/assets/lotties/loading-animation4.json";
import type BaseApiResponse from "~/types/BaseApiResponse";

definePageMeta({
    layout: "instagram",
});

const facebook = useFacebookStore();
const config = useRuntimeConfig();

const isProcessing = ref(false);
const defaultOptionNoData = ref({ animationData: loadingNoData });
const deletingFolderId = ref<string | null>(null);
const responseData = ref<MyDriveFoldersApiResponse | null>(null);
const requestLoadingElement = ref<HTMLElement | null>(null);

onMounted(async () => {
    const element = document.getElementById("loading_fetching_data");

    if (element) {
        requestLoadingElement.value = element as HTMLElement;
    }

    requestLoadingElement.value?.classList.remove("hidden");

    try {
        responseData.value = await $fetch<MyDriveFoldersApiResponse>(config.public.api_base + "/mydrive/folders?pymark_feature=instagram-post", {
            method: "get",
            headers: {
                Authorization: "Facebook " + facebook.userAccessToken,
            },
        });
    } catch (error: any) {
        responseData.value = error.response._data;
    }

    requestLoadingElement.value?.classList.add("hidden");
});

onBeforeUnmount(async () => {
    requestLoadingElement.value?.classList.add("hidden");
});

function navigateToFolder(folder_id: string) {
    navigateTo("/instagram-publisher/my_post/folders/" + folder_id);
}

const fetchData = async () => {
    console.log(config.public.api_base);
    responseData.value = null;

    requestLoadingElement.value?.classList.remove("hidden");

    await refreshFolderList();

    requestLoadingElement.value?.classList.add("hidden");
};

const confirmDeleteFolder = async (folderId: string) => {
    try {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            timer: 5000,
        });

        if (result.isConfirmed) {
            isProcessing.value = true;
            deletingFolderId.value = folderId;
            await deleteFolder(folderId);
        } else if (result.isDismissed) {
            Swal.fire({
                title: "Action canceled",
                icon: "info",
                timer: 2000,
                showConfirmButton: false,
                toast: true,
            });
        }
    } catch (error: any) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
        });
    } finally {
        isProcessing.value = false;
    }
};

const deleteFolder = async (folderId: string) => {
    try {
        const response: BaseApiResponse<null> = await $fetch(config.public.api_base + `/mydrive/folder/${folderId}`, {
            method: "delete",
            headers: {
                Authorization: "Facebook " + facebook.userAccessToken,
            },
        });

        if (response.status) {
            // Folder deleted successfully, refresh the folder list
            await refreshFolderList();
        } else {
            console.error("Error deleting folder:", response.message);
        }
    } catch (error) {
        console.error("Error deleting folder:", error);
    }
};

const fetchDataFromAPI = async (endpoint: string, method: "GET" | "POST" | "PUT" | "DELETE" = "GET") => {
    try {
        return await $fetch<MyDriveFoldersApiResponse>(config.public.api_base + endpoint, {
            method: method,
            headers: {
                Authorization: "Facebook " + facebook.userAccessToken,
            },
        });
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};
("/mydrive/folders?pymark_feature=instagram-post");

const refreshFolderList = async () => {
    try {
        responseData.value = await fetchDataFromAPI("/mydrive/folders?pymark_feature=instagram-post");
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};
</script>

<style scoped>
/* Your component-specific styles here */
</style>
