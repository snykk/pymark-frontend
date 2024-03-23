<template>
    <main class="relative">
        <!-- Navbar -->
        <nav class="flex mb-2">
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
                <!-- Table header -->
                <thead>
                    <tr>
                        <th class="py-2 text-left" colspan="2">Folder Name</th>
                        <th class="px-4 py-2 text-left">ID</th>
                        <th class="px-4 py-2 text-left">Actions</th>
                    </tr>
                </thead>
                <!-- Table body -->
                <tbody>
                    <tr v-for="(folder, index) in displayedFolders" :key="folder.id" class="cursor-pointer border-b border-gray-200" @click="!isProcessing && navigateToFolder(folder.id)">
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

            <!-- Pagination -->
            <nav v-if="totalItems > 0" class="flex flex-col items-center mt-2">
                <!-- Help text -->
                <span class="text-sm text-gray-700 dark:text-gray-400 mb-2">
                    Showing <span class="font-semibold text-gray-900 dark:text-white">{{ (currentPage - 1) * 10 + 1 }}</span> to
                    <span class="font-semibold text-gray-900 dark:text-white"> {{ (currentPage - 1) * 10 + (displayedFolders ? displayedFolders.length : 0) }}</span> of
                    <span class="font-semibold text-gray-900 dark:text-white">{{ totalItems }}</span> Entries
                </span>
                <ul class="flex items-center -space-x-px h-10 text-base">
                    <li>
                        <button
                            @click="firstPage"
                            :disabled="currentPage === 1"
                            class="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                            <span class="sr-only">Previous</span>
                            <svg class="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4" />
                            </svg>
                            <svg class="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4" />
                            </svg>
                        </button>
                    </li>
                    <li>
                        <button
                            @click="prevPage"
                            :disabled="currentPage === 1"
                            class="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                            <span class="sr-only">Previous</span>
                            <svg class="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4" />
                            </svg>
                        </button>
                    </li>
                    <li v-for="pageNumber in visiblePageNumbers" :key="pageNumber">
                        <button
                            @click="gotoPage(pageNumber)"
                            :class="{
                                'text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700': pageNumber === currentPage,
                                'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white':
                                    pageNumber !== currentPage,
                            }"
                            class="flex items-center justify-center px-4 h-10 leading-tight border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                            {{ pageNumber }}
                        </button>
                    </li>
                    <li>
                        <button
                            @click="nextPage"
                            :disabled="currentPage === totalPages"
                            class="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                            <span class="sr-only">Next</span>
                            <svg class="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                            </svg>
                        </button>
                    </li>
                    <li>
                        <button
                            @click="lastPage"
                            :disabled="currentPage === totalPages"
                            class="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                            <span class="sr-only">Next</span>
                            <svg class="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                            </svg>
                            <svg class="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                            </svg>
                        </button>
                    </li>
                </ul>
            </nav>
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
import type { Folder } from "~/types/MyDriveFoldersApiResponse";
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

// Pagination variables
const itemsPerPage = ref(10);
const currentPage = ref(1);
const totalItems = ref(0);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));
const displayedFolders = ref<Folder[]>();

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
    currentPage.value = 1;
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

        displayedFolders.value = responseData.value?.data.watermarking_folders.slice(0, itemsPerPage.value);
        totalItems.value = responseData.value?.data.watermarking_folders.length;
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

// Function to update displayed items based on the current page
const updateDisplayedItems = () => {
    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    const endIndex = Math.min(startIndex + itemsPerPage.value, totalItems.value);
    displayedFolders.value = responseData.value?.data.watermarking_folders.slice(startIndex, endIndex) || [];
};

// Watch for changes in totalItems and currentPage
watch([totalItems, currentPage], updateDisplayedItems);

const firstPage = () => {
    currentPage.value = 1;
};

const lastPage = () => {
    currentPage.value = totalPages.value;
};

// Function to navigate to the previous page
const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};

// Function to navigate to the next page
const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
};

// Function to navigate to a specific page
const gotoPage = (page: number) => {
    if (page > 0 && page <= totalPages.value) {
        currentPage.value = page;
    }
};

// Compute the range of visible page numbers
const visiblePageNumbers = computed(() => {
    const pagesToShow = 5; // Number of pages to display
    const pages = [];
    let startPage = Math.max(1, currentPage.value - Math.floor(pagesToShow / 2));
    let endPage = Math.min(totalPages.value, startPage + pagesToShow - 1);

    if (totalPages.value <= pagesToShow) {
        startPage = 1;
        endPage = totalPages.value;
    } else if (currentPage.value <= Math.ceil(pagesToShow / 2)) {
        startPage = 1;
        endPage = pagesToShow;
    } else if (currentPage.value + Math.floor(pagesToShow / 2) >= totalPages.value) {
        startPage = totalPages.value - pagesToShow + 1;
        endPage = totalPages.value;
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return pages;
});
</script>

<style scoped>
/* Your component-specific styles here */
</style>
