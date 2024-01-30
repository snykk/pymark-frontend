<template>
    <div>
        <div v-if="responseData">
            <h2 class="text-2xl font-semibold mb-6">Folder Details</h2>
            <div class="overflow-x-auto">
                <table class="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                    <thead class="bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th class="py-3 px-4 text-left">File ID</th>
                            <th class="py-3 px-4 text-left">Name</th>
                            <th class="py-3 px-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="file in responseData.data.files" :key="file.id" class="border-b border-gray-200 dark:border-gray-600">
                            <td class="py-4 px-6">{{ file.id }}</td>
                            <td class="py-4 px-6">{{ file.name }}</td>
                            <td class="py-4 px-6">
                                <a :href="file.links.download_link" target="_blank" class="text-blue-500 dark:text-blue-400">Download</a>
                                <span class="mx-2 text-gray-400 dark:text-gray-600">|</span>
                                <a v-if="isImageFile(file.name)" href="#" @click.prevent="showImagePreview(file.links.thumbnail_link.replace(/=s\d+$/, ''))" class="text-blue-500 dark:text-blue-400">Web View</a>
                                <a v-else :href="file.links.web_view_link" target="blank" class="text-blue-500 dark:text-blue-400">Web View</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
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
        </div>
    </div>
</template>

<script setup lang="ts">
import type MyDriveFolderDetailApiResponse from "~/types/MyDriveFolderDetailApiResponse";
import { isImageFile } from "~/helpers/image";

definePageMeta({
    layout: "instagram",
});

const facebook = useFacebookStore();
const route = useRoute();
const config = useRuntimeConfig();

const responseData = ref<MyDriveFolderDetailApiResponse | null>(null);
const showModal = ref(false);
const previewImage = ref("");
const requestLoadingElement = ref<HTMLElement | null>(null);

const showImagePreview = (imageUrl: string) => {
    previewImage.value = imageUrl;
    showModal.value = true;
    console.log(previewImage.value);
};

const closeModal = () => {
    previewImage.value = "";
    showModal.value = false;
};

onMounted(async () => {
    const element = document.getElementById("request_loading2");

    if (element) {
        requestLoadingElement.value = element as HTMLElement;
    }

    requestLoadingElement.value?.classList.remove("hidden");

    try {
        responseData.value = await $fetch<MyDriveFolderDetailApiResponse>(config.public.api_base + "/mydrive/folder/" + route.params.id, {
            method: "get",
            headers: {
                Authorization: "Facebook " + facebook.userAccessToken,
            },
        });
    } catch (error) {
        console.error("Error fetching folder details:", error);
    }

    requestLoadingElement.value?.classList.add("hidden");
});

onBeforeUnmount(async () => {
    requestLoadingElement.value?.classList.add("hidden");
});
</script>

<style scoped>
/* Your component-specific styles here */
</style>
