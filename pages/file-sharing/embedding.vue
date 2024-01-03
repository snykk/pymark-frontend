<template>
    <div class="px-4">
        <h1 class="text-2xl font-bold mb-4">Form Pymark Embedding</h1>
        <form @submit.prevent="submitForm" class="space-y-4" enctype="multipart/form-data">
            <div class="flex flex-col md:flex-row">
                <div class="flex flex-col md:w-1/2">
                    <label for="host_image" class="block mb-2 text-sm font-medium">Host Image</label>
                    <img v-if="imagePreviews[0]" :src="imagePreviews[0]" class="ml-4 h-40 w-40 mb-3" alt="Preview Host Image" />
                    <input
                        type="file"
                        id="host_image"
                        accept="image/*"
                        ref="fileInput1"
                        class="block w-full mb-5 text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                        @change="handleImageChange(1, $event)"
                    />
                    <span v-if="formSubmitted && !host_image" class="text-red-500">Host Image is required</span>
                </div>
                <div class="flex flex-col md:ms-3 md:w-1/2">
                    <label for="watermark_image" class="block mb-2 text-sm font-medium">Watermark Image</label>
                    <img v-if="imagePreviews[1]" :src="imagePreviews[1]" class="ml-4 h-40 w-40 mb-3" alt="Preview Watermark Image" />
                    <input
                        type="file"
                        id="watermark_image"
                        accept="image/*"
                        ref="fileInput1"
                        class="block w-full mb-5 text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                        @change="handleImageChange(2, $event)"
                    />
                    <span v-if="formSubmitted && !watermark_image" class="text-red-500">Watermark Image is required</span>
                </div>
            </div>
            <div class="flex flex-col">
                <!-- <label for="type" class="block mb-2 text-sm font-medium">Jenis Gambar</label>
                <select
                    id="type"
                    v-model="type"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                    <option value="gray">Gray</option>
                    <option value="color">Color</option>
                </select> -->
                <DropdownInput v-model="type" label="type" :options="typeOptions" />
                <span v-if="formSubmitted && !type" class="text-red-500">Image Type is required</span>
            </div>
            <div class="flex flex-col">
                <!-- <label for="alpha" class="block mb-2 text-sm font-medium">Alpha</label>
                <select
                    id="alpha"
                    v-model="alpha"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                    <option v-for="value in alphaValues" :key="value" :value="value">{{ value }}</option>
                </select> -->
                <DropdownInput v-model="alpha" label="alpha" :options="alphaOptions" />
                <span v-if="formSubmitted && !alpha" class="text-red-500">Alpha is required</span>
            </div>
            <div class="flex justify-center">
                <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">{{ formSubtmitting ? "submitting" : "submit" }}</button>
            </div>
        </form>

        <!-- Bagian untuk menampilkan preview dari respons API -->
        <div v-if="responseData && responseData.data">
            <h2 class="text-2xl font-bold mb-4">Hasil dari Respons API</h2>
            <div>
                <p class="mb-2">Folder Result: {{ responseData.data.folder_result }}</p>
                <div class="mb-4">
                    <p class="font-semibold">Imperceptibility Analysis:</p>
                    <ul>
                        <li>PSNR: {{ responseData.data.imperceptibility_analysis.psnr }}</li>
                        <li>SSIM: {{ responseData.data.imperceptibility_analysis.ssim }}</li>
                    </ul>
                </div>
            </div>
            <div v-if="responseData.data.uploaded_file_responses">
                <h2 class="text-2xl font-bold mb-4">Preview Gambar Watermarked</h2>
                <div class="border rounded-lg overflow-hidden">
                    <img :src="responseData.data.uploaded_file_responses.watermarked_image.download_link" alt="Preview Watermarked Image" class="h-64 w-full object-cover" />
                    <div class="p-4">
                        <p class="mb-2">ID: {{ responseData.data.uploaded_file_responses.watermarked_image.id }}</p>
                        <a :href="responseData.data.uploaded_file_responses.watermarked_image.web_view_link" target="_blank" class="text-blue-500 hover:underline">Tautan Tampilan Web</a>
                    </div>
                </div>
                <div>
                    <h2 class="text-2xl font-bold mb-4">Link Lainnya</h2>
                    <ul class="list-disc list-inside">
                        <li><a :href="responseData.data.uploaded_file_responses.block_position.web_view_link" target="_blank" class="text-blue-500 hover:underline">Link Block Position</a></li>
                        <li><a :href="responseData.data.uploaded_file_responses.embedding_result_zip.web_view_link" target="_blank" class="text-blue-500 hover:underline">Link Embedding Result Zip</a></li>
                        <li><a :href="responseData.data.uploaded_file_responses.key_matrix.web_view_link" target="_blank" class="text-blue-500 hover:underline">Link Key Matrix</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: "filesharing",
    middleware: ["auth-filesharing"],
});

const filesharing = useFileSharingStore();

import type { EmbeddingApiResponse } from "~/types/EmbeddingApiResponse";

const config = useRuntimeConfig();

const formSubmitted = ref(false);
const formSubtmitting = ref(false);

const host_image = ref<File | null>(null);
const watermark_image = ref<File | null>(null);
const imagePreviews = ref<(string | null)[]>([null, null]);

const typeOptions = ["grayscale", "color"];
const type = ref("grayscale");

const alphaOptions = ["0.01", "0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8", "0.9"];
const alpha = ref("0.01");

var responseData = ref<EmbeddingApiResponse | null>(null);
function handleImageChange(index: number, event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target || !target.files) return;

    const file = target.files[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
            if (index === 1) {
                host_image.value = file;
                imagePreviews.value[0] = result;
            } else if (index === 2) {
                watermark_image.value = file;
                imagePreviews.value[1] = result;
            }
        }
    };
    fileReader.readAsDataURL(file);
}

function validateForm() {
    return {
        host_image: !!host_image.value,
        watermark_image: !!watermark_image.value,
        type: !!type.value,
        alpha: !!alpha.value,
    };
}

async function submitForm() {
    formSubmitted.value = true;
    formSubtmitting.value = true;

    const validations = validateForm();

    const isValid = Object.values(validations).every((field) => field);
    if (!isValid) {
        // Handle error messages or prevent form submission
        return;
    }

    const formData = new FormData();

    if (host_image.value) formData.append("host_image", host_image.value);
    if (watermark_image.value) formData.append("watermark_image", watermark_image.value);
    formData.append("type", type.value);
    formData.append("alpha", alpha.value.toString());

    try {
        const response = await $fetch<EmbeddingApiResponse>(config.public.api_base + "/pymark/embed_gray", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + filesharing.userJWTToken,
            },
            body: formData,
        });

        responseData.value = response;
        formSubtmitting.value = false;
    } catch (error) {
        console.error("Error:", error);
    }
}
</script>
