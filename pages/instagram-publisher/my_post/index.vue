<template>
    <main>
        <!-- Content -->
        <div v-if="responseData?.status === true">
            <h2 class="text-xl font-semibold mb-4">Folder List</h2>
            <table class="min-w-full text-start">
                <thead>
                    <tr>
                        <th></th>
                        <th class="px-4 py-2 text-left">Folder Name</th>
                        <th class="px-4 py-2 text-left">ID</th>
                        <th class="px-4 py-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="folder in responseData?.data.watermarking_folders" :key="folder.id" class="cursor-pointer border-b border-gray-200" @click="navigateToFolder(folder.id)">
                        <td>
                            <img alt="Folder icon" src="~/assets/icon/folder2.svg" width="30" height="30" />
                        </td>
                        <td class="pr-4 py-2 flex">
                            {{ folder.name }}
                        </td>
                        <td class="px-4 py-2">{{ folder.id }}</td>
                        <td class="px-4 py-2">
                            <button @click.stop="confirmDeleteFolder(folder.id)" class="text-red-600 hover:text-red-800">Delete</button>
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
import type { MyDriveFoldersApiResponse } from "~/types/MyDriveFoldersApiResponse";
import loadingNoData from "~/assets/lotties/loading-animation4.json";

const defaultOptionNoData = ref({ animationData: loadingNoData });

definePageMeta({
    layout: "instagram",
});

const facebook = useFacebookStore();

const config = useRuntimeConfig();
const responseData = ref<MyDriveFoldersApiResponse | null>(null);

const requestLoadingElement = ref<HTMLElement | null>(null);

onMounted(async () => {
    const element = document.getElementById("request_loading2");

    if (element) {
        requestLoadingElement.value = element as HTMLElement;
    }

    requestLoadingElement.value?.classList.remove("hidden");

    responseData.value = await $fetch<MyDriveFoldersApiResponse>(config.public.api_base + "/mydrive/folders?pymark_feature=instagram-post", {
        method: "get",
        headers: {
            Authorization: "Facebook " + facebook.userAccessToken,
        },
    });

    requestLoadingElement.value?.classList.add("hidden");
});

onBeforeUnmount(async () => {
    requestLoadingElement.value?.classList.add("hidden");
});

function navigateToFolder(folder_id: string) {
    navigateTo("/instagram-publisher/my_post/folders/" + folder_id);
}

const handleClick = () => {
    fetchData();
};

const fetchData = async () => {
    console.log(config.public.api_base);
    responseData.value = null;

    requestLoadingElement.value?.classList.remove("hidden");
    try {
        responseData.value = await $fetch<MyDriveFoldersApiResponse>(config.public.api_base + "/mydrive/folders?pymark_feature=instagram-post", {
            method: "get",
            headers: {
                Authorization: "Facebook " + facebook.userAccessToken,
            },
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }

    requestLoadingElement.value?.classList.add("hidden");
};

const confirmDeleteFolder = (folderId: string) => {
    const isConfirmed = confirm("Are you sure you want to delete this folder?");

    if (isConfirmed) {
        // Call the API to delete the folder
        deleteFolder(folderId);
    }
};

const deleteFolder = async (folderId: string) => {
    requestLoadingElement.value?.classList.remove("hidden");
    responseData.value = null;

    try {
        const response = await $fetch(config.public.api_base + `/mydrive/folder/${folderId}`, {
            method: "delete",
            headers: {
                Authorization: "Facebook " + facebook.userAccessToken,
            },
        });

        console.log("response delete:", response);

        if (response.status) {
            // Folder deleted successfully, refresh the folder list
            fetchData();
        } else {
            console.error("Error deleting folder:", response.message);
        }
    } catch (error) {
        console.error("Error deleting folder:", error);
    }
};
</script>

<style scoped>
/* Your component-specific styles here */
</style>
