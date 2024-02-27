<template>
    <main class="relative">
        <!-- Navbar -->
        <nav class="flex mb-4">
            <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li :class="{ 'font-extrabold': selectedDrive === 'embedding' }" @click="!isProcessing && handleClick('embedding')" class="text-sm text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white cursor-pointer">
                    Embedding
                </li>
                <span class="mx-2 text-gray-400 text-xl">/</span>
                <li :class="{ 'font-extrabold': selectedDrive === 'extraction' }" @click="!isProcessing && handleClick('extraction')" class="text-sm text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white cursor-pointer">
                    Extraction
                </li>
                <span class="mx-2 text-gray-400 text-xl">/</span>
                <li
                    :class="{ 'font-extrabold': selectedDrive === 'image-processing' }"
                    @click="!isProcessing && handleClick('image-processing')"
                    class="text-sm text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white cursor-pointer"
                >
                    Image Processing
                </li>
                <UserGuideButton @click="showUserGuideModal" />
            </ol>
        </nav>

        <!-- Content -->
        <div v-if="responseData?.status === true" class="max-w-full overflow-x-auto">
            <table class="min-w-full text-start">
                <thead>
                    <tr>
                        <th class="py-2 text-left" colspan="2">Folder Name</th>
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

        <!-- PyMark My Drive User Guide Modal -->
        <div v-if="showUserGuide" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                <button @click="hideUserGuideModal" class="absolute top-3 right-3 text-gray-500 dark:text-gray-400 focus:outline-none">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>

                <div class="relative bg-gray-50 dark:bg-gray-800 w-full max-w-[80vw] p-6 rounded-lg shadow-lg overflow-y-auto max-h-[80vh] text-justify text-align-last-justify">
                    <h2 class="text-xl font-bold mb-4">PyMark My Drive User Guide</h2>
                    <p class="mb-4">PyMark My Drive is a feature that allows you to manage your watermarking folders, organized by different PyMark features such as Embedding, Extraction, and Image Processing.</p>
                    <p class="mb-4">Here's a guide on how to use the PyMark My Drive feature:</p>
                    <ol class="list-decimal list-inside mb-4">
                        <li class="mb-1">Click on the desired feature (Embedding, Extraction, or Image Processing) from the navigation bar.</li>
                        <li class="mb-1">Browse through the list of folders displayed, each representing a specific watermarking result from your previous task</li>
                        <li class="mb-1">Click on a folder to view its details or perform actions such as deletion.</li>
                    </ol>
                    <p class="">You can perform various file management tasks within PyMark My Drive to organize your files efficiently.</p>
                </div>
            </div>
        </div>

        <!-- back to top button -->
        <BackToTopButton />
    </main>
</template>

<script setup lang="ts">
import Swal from "sweetalert2";
import type MyDriveFoldersApiResponse from "~/types/MyDriveFoldersApiResponse";
import loadingNoData from "~/assets/lotties/loading-animation4.json";

const defaultOptionNoData = ref({ animationData: loadingNoData });

definePageMeta({
    layout: "filesharing",
    middleware: ["auth-filesharing"],
});

const filesharing = useFileSharingStore();
const config = useRuntimeConfig();

const isProcessing = ref(false);
const deletingFolderId = ref<string | null>(null); // Store the id of the folder being deleted
const selectedDrive = ref<"embedding" | "extraction" | "image-processing">("embedding");
const responseData = ref<MyDriveFoldersApiResponse | null>(null);
const requestLoadingElement = ref<HTMLElement | null>(null);
const showUserGuide = ref(false);

onMounted(async () => {
    const element = document.getElementById("loading_fetching_data");

    if (element) {
        requestLoadingElement.value = element as HTMLElement;
    }

    requestLoadingElement.value?.classList.remove("hidden");

    fetchData(selectedDrive.value);
});

onBeforeUnmount(async () => {
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
    isProcessing.value = true;
    requestLoadingElement.value?.classList.remove("hidden");

    await refreshFolderList(feature);

    requestLoadingElement.value?.classList.add("hidden");
    isProcessing.value = false;
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
        const response = await fetchDataFromAPI(`/mydrive/folder/${folderId}`, "DELETE");
        console.log("response delete:", response);
        if (response.status) {
            await refreshFolderList(selectedDrive.value);
        } else {
            console.error("Error deleting folder:", response.message);
        }
    } catch (error) {
        console.error("Error deleting folder:", error);
    } finally {
        deletingFolderId.value = null;
    }
};

const fetchDataFromAPI = async (endpoint: string, method: "GET" | "POST" | "PUT" | "DELETE" = "GET") => {
    try {
        return await $fetch<MyDriveFoldersApiResponse>(config.public.api_base + endpoint, {
            method: method,
            headers: {
                Authorization: "Bearer " + filesharing.userJWTToken,
            },
        });
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

const refreshFolderList = async (feature: "embedding" | "extraction" | "image-processing") => {
    try {
        responseData.value = await fetchDataFromAPI(`/mydrive/folders?pymark_feature=${selectedDrive.value}`);
        selectedDrive.value = feature;
    } catch (error: any) {
        responseData.value = error.response._data;
        console.error("Error fetching data:", error);
    }
};

function showUserGuideModal() {
    showUserGuide.value = true;
}

function hideUserGuideModal() {
    showUserGuide.value = false;
}
</script>

<style scoped>
/* Your component-specific styles here */
</style>
