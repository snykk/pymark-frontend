<template>
    <div class="relative">
        <div v-if="isLoaded">
            <h2 class="text-2xl font-semibold mb-6">Folder Details</h2>
            <div class="overflow-x-auto">
                <div class="max-w-full overflow-x-auto">
                    <table class="min-w-full bg-gray-50 dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                        <thead class="bg-gray-100 dark:bg-gray-700">
                            <tr>
                                <th class="py-3 px-4 text-left">File ID</th>
                                <th class="py-3 px-4 text-left">Name</th>
                                <th class="py-3 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="file in responseData!.data.files" :key="file.id" class="border-b border-gray-200 dark:border-gray-600">
                                <td class="py-4 px-6">{{ file.id }}</td>
                                <td class="py-4 px-6">{{ file.name }}</td>
                                <td class="py-4 px-6">
                                    <a :href="file.links.download_link" target="_blank" class="text-blue-500 dark:text-blue-400">Download</a>
                                    <span class="mx-2 text-gray-400 dark:text-gray-600">|</span>
                                    <a v-if="isImageFile(file.name)" href="#" @click.prevent="showImagePreview(file.links.thumbnail_link.replace(/=s\d+$/, ''))" class="text-blue-500 dark:text-blue-400">Web View</a>
                                    <a v-else-if="isTextFile(file.name)" href="#" @click.prevent="showTextPreview(file.id)" class="text-blue-500 dark:text-blue-400">Web View</a>
                                    <a v-else :href="file.links.web_view_link" target="blank" class="text-blue-500 dark:text-blue-400">Web View</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- File content -->
                <div class="max-w-full overflow-x-auto">
                    <div v-if="textContent !== ''" class="min-w-full overflow-hidden mt-4">
                        <h2 class="text-lg font-semibold mb-2">File Content</h2>
                        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
                            <pre class="whitespace-pre overflow-x-auto overflow-y-hidden">{{ textContent }}</pre>
                        </div>
                    </div>
                </div>

                <NuxtLink class="flex justify-end mt-4" to="/file-sharing/my_drive"
                    ><button
                        type="button"
                        class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                    >
                        Back to My Drive
                    </button></NuxtLink
                >
            </div>

            <!-- Modal -->
            <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                    <button @click="closeModal" class="absolute top-3 right-3 text-gray-500 dark:text-gray-400 focus:outline-none">
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                    <img :src="previewImage" alt="Preview Image" class="w-full max-h-[80vh] max-w-[80vw] object-contain" />
                </div>
            </div>

            <!-- Modal untuk file teks -->
            <div v-if="showModalText" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                    <!-- Konten teks -->
                    <pre class="p-4">{{ textContent }}</pre>
                    <!-- Tombol tutup modal -->
                    <button @click="closeModalText" class="absolute top-3 right-3 text-gray-500 dark:text-gray-400 focus:outline-none">
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- back to top button -->
        <BackToTopButton />
    </div>
</template>

<script setup lang="ts">
import { isImageFile, isTextFile } from "~/helpers/extension";

definePageMeta({
    layout: "filesharing",
    middleware: "auth-filesharing",
});

const filesharing = useFileSharingStore();
const route = useRoute();
const config = useRuntimeConfig();

const responseData = ref<MyDriveFolderDetailApiResponse | null>(null);
const showModal = ref(false);
const isLoaded = ref(false);
const previewImage = ref("");
const requestLoadingElement = ref<HTMLElement | null>(null);
const textContent = ref<String>("");
const showModalText = ref(false);

onMounted(async () => {
    const element = document.getElementById("loading_fetching_data");

    if (element) {
        requestLoadingElement.value = element as HTMLElement;
    }

    requestLoadingElement.value?.classList.remove("hidden");

    try {
        responseData.value = await $fetch<MyDriveFolderDetailApiResponse>(config.public.api_base + "/mydrive/folder/" + route.params.id, {
            method: "get",
            headers: {
                Authorization: "Bearer " + filesharing.userJWTToken,
            },
        });

        const metadata = responseData.value.data.files.find((file) => file.name === "metadata.txt");

        if (metadata) {
            console.log("ada metadata");
            const file = await getFileContent(metadata!.id);
            textContent.value = file;
        }
    } catch (error) {
        console.error("Error fetching folder details:", error);
    }

    isLoaded.value = true;
    requestLoadingElement.value?.classList.add("hidden");
});

onBeforeUnmount(async () => {
    requestLoadingElement.value?.classList.add("hidden");
});

const showImagePreview = (imageUrl: string) => {
    previewImage.value = imageUrl;
    showModal.value = true;
    console.log(previewImage.value);
};

const closeModal = () => {
    previewImage.value = "";
    showModal.value = false;
};

// Metode untuk menampilkan konten file teks
const showTextPreview = async (fileId: string) => {
    showModalText.value = true; // Menampilkan modal
};

// Metode untuk menutup modal teks
const closeModalText = () => {
    showModalText.value = false; // Menutup modal
};

const getFileContent = async (fileId: string) => {
    try {
        // Panggil endpoint backend yang sesuai untuk mendapatkan konten file dengan ID tertentu
        const response: BaseApiResponse<String> = await $fetch(config.public.api_base + "/mydrive/file-content/" + fileId, {
            method: "GET",
            headers: {
                // Tambahkan header otorisasi jika diperlukan
                Authorization: "Bearer " + filesharing.userJWTToken,
            },
        });

        // Periksa status respons
        if (!response.status) {
            // Jika respons tidak berhasil, lempar kesalahan dengan pesan yang sesuai
            throw new Error("Failed to fetch file content");
        }

        // Kembalikan konten file
        return response.data;
    } catch (error) {
        // Tangani kesalahan yang terjadi selama pengambilan konten file
        console.error("Error fetching file content:", error);
        throw error; // Lepaskan kembali kesalahan untuk menangkapnya di tempat panggilan
    }
};
</script>

<style scoped>
/* Your component-specific styles here */
</style>
~/helpers/extension
