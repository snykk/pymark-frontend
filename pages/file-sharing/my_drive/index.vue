<template>
    <main>
        <!-- Navbar -->
        <nav class="flex mb-4">
            <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li :class="{ 'font-extrabold': selectedDrive === 'embedding' }" @click="handleClick('embedding')" class="text-sm text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white cursor-pointer">Embedding</li>
                <span class="mx-2 text-gray-400 text-xl">/</span>
                <li :class="{ 'font-extrabold': selectedDrive === 'extraction' }" @click="handleClick('extraction')" class="text-sm text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white cursor-pointer">Extraction</li>
                <span class="mx-2 text-gray-400 text-xl">/</span>
                <li :class="{ 'font-extrabold': selectedDrive === 'image-processing' }" @click="handleClick('image-processing')" class="text-sm text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white cursor-pointer">
                    Image Processing
                </li>
            </ol>
        </nav>

        <!-- Content -->
        <div v-if="responseData?.status === true">
            <h2 class="text-xl font-semibold mb-4">Folder List</h2>
            <table class="min-w-full text-start">
                <thead>
                    <tr>
                        <th></th>
                        <th class="px-4 py-2 text-left">Folder Name</th>
                        <th class="px-4 py-2 text-left">ID</th>
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
    layout: "filesharing",
    middleware: ["auth-filesharing"],
});

const filesharing = useFileSharingStore();

const config = useRuntimeConfig();
const selectedDrive = ref<"embedding" | "extraction" | "image-processing">("embedding");
const responseData = ref<MyDriveFoldersApiResponse | null>(null);

const requestLoadingElement = ref<HTMLElement | null>(null);

onMounted(async () => {
    const element = document.getElementById("request_loading2");

    if (element) {
        requestLoadingElement.value = element as HTMLElement;
    }

    requestLoadingElement.value?.classList.remove("hidden");

    responseData.value = await $fetch<MyDriveFoldersApiResponse>(config.public.api_base + "/mydrive/folders?pymark_feature=" + selectedDrive.value, {
        method: "get",
        headers: {
            Authorization: "Bearer " + filesharing.userJWTToken,
        },
    });

    requestLoadingElement.value?.classList.add("hidden");
});

function navigateToFolder(folder_id: string) {
    navigateTo("/file-sharing/my_drive/folders/" + folder_id);
}

const handleClick = (feature: "embedding" | "extraction" | "image-processing") => {
    selectedDrive.value = feature;
    fetchData(feature);
};

const fetchData = async (feature: "embedding" | "extraction" | "image-processing") => {
    console.log(config.public.api_base);
    responseData.value = null;

    requestLoadingElement.value?.classList.remove("hidden");
    try {
        responseData.value = await $fetch<MyDriveFoldersApiResponse>(config.public.api_base + "/mydrive/folders?pymark_feature=" + feature, {
            method: "get",
            headers: {
                Authorization: "Bearer " + filesharing.userJWTToken,
            },
        });
        selectedDrive.value = feature;
    } catch (error) {
        console.error("Error fetching data:", error);
    }

    requestLoadingElement.value?.classList.add("hidden");
};
</script>

<style scoped>
/* Your component-specific styles here */
</style>
