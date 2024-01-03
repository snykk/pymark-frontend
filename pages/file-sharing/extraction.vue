<template>
    <div class="p-4">
        <h1 class="text-2xl font-bold mb-4">Form Pymark Extraction</h1>
        <form @submit.prevent="submitForm" class="space-y-4" enctype="multipart/form-data">
            <div class="flex flex-col">
                <label for="watermark_image" class="mb-1">Watermark Image (Opsional if you wanna see the analysis result)</label>
                <input type="file" id="watermark_image" accept="image/*" ref="fileInput1" style="display: none" @change="handleFileChange(1, $event)" class="p-2 border rounded" />
                <div class="flex items-center">
                    <label for="watermark_image" class="cursor-pointer bg-gray-200 p-2 rounded">Select Image 1</label>
                    <img v-if="imagePreviews[0]" :src="imagePreviews[0]" class="ml-4 h-20" alt="Preview Image 1" />
                </div>
                <span v-if="formSubmitted && !watermark_image" class="text-red-500">Watermark Image is required</span>
            </div>
            <div class="flex flex-col">
                <label for="watermarked_image" class="mb-1">Watermarked Image</label>
                <input type="file" id="watermarked_image" accept="image/*" ref="fileInput1" style="display: none" @change="handleFileChange(2, $event)" class="p-2 border rounded" />
                <div class="flex items-center">
                    <label for="watermarked_image" class="cursor-pointer bg-gray-200 p-2 rounded">Select Image 1</label>
                    <img v-if="imagePreviews[1]" :src="imagePreviews[1]" class="ml-4 h-20" alt="Preview Image 1" />
                </div>
                <span v-if="formSubmitted && !watermarked_image" class="text-red-500">Watermarked Image is required</span>
            </div>
            <div class="flex flex-col">
                <label for="block_position" class="mb-1">Block Position</label>
                <input type="file" id="block_position" accept="image/*" ref="fileInput2" style="display: none" @change="handleFileChange(3, $event)" class="p-2 border rounded" />
                <div class="flex items-center">
                    <label for="block_position" class="cursor-pointer bg-gray-200 p-2 rounded">Select Image 2</label>
                    <img v-if="imagePreviews[2]" :src="imagePreviews[2]" class="ml-4 h-20" alt="Preview Image 2" />
                </div>
                <span v-if="formSubmitted && !block_position" class="text-red-500">Block Position is required</span>
            </div>
            <div class="flex flex-col">
                <label for="key_matrix" class="mb-1">Key Matrix (.npy)</label>
                <input type="file" id="key_matrix" accept=".npy" ref="fileInput3" style="display: none" @change="handleFileChange(4, $event)" class="p-2 border rounded" />
                <div class="flex items-center">
                    <label for="key_matrix" class="cursor-pointer bg-gray-200 p-2 rounded">Select .npy File</label>
                    <!-- Tampilkan nama file jika dipilih -->
                    <span v-if="key_matrix && key_matrix.name">{{ key_matrix.name }}</span>
                </div>
                <span v-if="formSubmitted && !key_matrix" class="text-red-500">Key Matrix (.npy) is required</span>
            </div>
            <div class="flex flex-col">
                <DropdownInput v-model="type" label="type" :options="typeOptions" />
                <span v-if="formSubmitted && !type" class="text-red-500">Image Type is required</span>
            </div>
            <div class="flex flex-col">
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
                <div v-if="responseData.data.robustness_analysis" class="mb-4">
                    <p class="font-semibold">Robustness Analysis:</p>
                    <ul>
                        <li>BER: {{ responseData.data.robustness_analysis.ber }}</li>
                        <li>NCC: {{ responseData.data.robustness_analysis.ncc }}</li>
                    </ul>
                </div>
            </div>
            <div v-if="responseData.data.uploaded_file_responses">
                <h2 class="text-2xl font-bold mb-4">Preview Gambar Watermarked</h2>
                <div class="border rounded-lg overflow-hidden">
                    <img :src="responseData.data.uploaded_file_responses.extracted_watermark.download_link" alt="Preview Watermarked Image" class="h-64 w-full object-cover" />
                    <div class="p-4">
                        <p class="mb-2">ID: {{ responseData.data.uploaded_file_responses.extracted_watermark.id }}</p>
                        <a :href="responseData.data.uploaded_file_responses.extracted_watermark.web_view_link" target="_blank" class="text-blue-500 hover:underline">Tautan Tampilan Web</a>
                    </div>
                </div>
                <div>
                    <h2 class="text-2xl font-bold mb-4">Link Lainnya</h2>
                    <ul class="list-disc list-inside">
                        <li><a :href="responseData.data.uploaded_file_responses.block_position.web_view_link" target="_blank" class="text-blue-500 hover:underline">Link Block Position</a></li>
                        <li><a :href="responseData.data.uploaded_file_responses.embedding_result_zip.web_view_link" target="_blank" class="text-blue-500 hover:underline">Link Embedding Result Zip</a></li>
                        <li><a :href="responseData.data.uploaded_file_responses.extracted_watermark.web_view_link" target="_blank" class="text-blue-500 hover:underline">Link Extracted Watermark</a></li>
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

import type { ExtractionApiResponse } from "~/types/ExtractionApiResponse";

const config = useRuntimeConfig();

const formSubmitted = ref(false);
const formSubtmitting = ref(false);

const watermark_image = ref<File | null>(null);
const watermarked_image = ref<File | null>(null);
const block_position = ref<File | null>(null);
const key_matrix = ref<File | null>(null); // Tambahkan variabel untuk file .npy

const imagePreviews = ref<(string | null)[]>([null]);

const typeOptions = ["grayscale", "color"];
const type = ref("grayscale");

const alphaOptions = ["0.01", "0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8", "0.9"];
const alpha = ref("0.01");

var responseData = ref<ExtractionApiResponse | null>(null);

function handleFileChange(index: number, event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target || !target.files) return;

    const file = target.files[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
            if (index == 1) {
                watermark_image.value = file;
                imagePreviews.value[0] = result;
            } else if (index === 2) {
                watermarked_image.value = file;
                imagePreviews.value[1] = result;
            } else if (index === 3) {
                block_position.value = file;
                imagePreviews.value[2] = result;
            }
            // Menambahkan kondisi untuk file .npy (key_matrix)
            else if (index === 4) {
                key_matrix.value = file;
            }
        }
    };
    fileReader.readAsDataURL(file);
}

function validateForm() {
    return {
        watermarked_image: !!watermarked_image.value,
        block_position: !!block_position.value,
        // Memvalidasi key_matrix
        key_matrix: !!key_matrix.value,
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
    if (watermark_image.value) formData.append("watermark_image", watermark_image.value);
    if (watermarked_image.value) formData.append("watermarked_image", watermarked_image.value);
    if (block_position.value) formData.append("block_position", block_position.value);
    // Mengirim key_matrix
    if (key_matrix.value) formData.append("key_matrix", key_matrix.value);
    formData.append("type", type.value);
    formData.append("alpha", alpha.value.toString());

    try {
        const response = await $fetch<ExtractionApiResponse>(config.public.api_base + "/pymark/extract_gray", {
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
