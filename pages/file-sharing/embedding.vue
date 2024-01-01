<template>
    <div class="p-4">
        <h1 class="text-2xl font-bold mb-4">Form Pymark Embedding</h1>
        <form @submit.prevent="submitForm" class="space-y-4" enctype="multipart/form-data">
            <div class="flex flex-col">
                <label for="host_image" class="mb-1">Host Image</label>
                <input type="file" id="host_image" accept="image/*" ref="fileInput1" style="display: none" @change="handleImageChange(1, $event)" class="p-2 border rounded" />
                <div class="flex items-center">
                    <label for="host_image" class="cursor-pointer bg-gray-200 p-2 rounded">Select Image 1</label>
                    <img v-if="imagePreviews[0]" :src="imagePreviews[0]" class="ml-4 h-20" alt="Preview Image 1" />
                </div>
                <span v-if="formSubmitted && !host_image" class="text-red-500">Host Image is required</span>
            </div>
            <div class="flex flex-col">
                <label for="watermark_image" class="mb-1">Watermark Image</label>
                <input type="file" id="watermark_image" accept="image/*" ref="fileInput2" style="display: none" @change="handleImageChange(2, $event)" class="p-2 border rounded" />
                <div class="flex items-center">
                    <label for="watermark_image" class="cursor-pointer bg-gray-200 p-2 rounded">Select Image 2</label>
                    <img v-if="imagePreviews[1]" :src="imagePreviews[1]" class="ml-4 h-20" alt="Preview Image 2" />
                </div>
                <span v-if="formSubmitted && !watermark_image" class="text-red-500">Watermark Image is required</span>
            </div>
            <div class="flex flex-col">
                <label for="imageType" class="mb-1">Jenis Gambar</label>
                <select id="imageType" v-model="imageType" class="p-2 border rounded">
                    <option value="gray">gray</option>
                    <option value="color">color</option>
                </select>
                <span v-if="formSubmitted && !imageType" class="text-red-500">Image Type is required</span>
            </div>
            <div class="flex flex-col">
                <label for="alpha" class="mb-1">Alpha</label>
                <select id="alpha" v-model="alpha" class="p-2 border rounded">
                    <option v-for="value in alphaValues" :key="value" :value="value">{{ value }}</option>
                </select>
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
import type { EmbeddingApiResponse } from "~/types/EmbeddingApiResponse";

const config = useRuntimeConfig();

const formSubmitted = ref(false);
const formSubtmitting = ref(false);

const host_image = ref<File | null>(null);
const watermark_image = ref<File | null>(null);
const imagePreviews = ref<(string | null)[]>([null, null]);

const imageType = ref("gray");
const alpha = ref(0.01);
const alphaValues = [0.01, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];

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
        imageType: !!imageType.value,
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
    formData.append("imageType", imageType.value);
    formData.append("alpha", alpha.value.toString());

    try {
        console.log("buat request");
        const response = await $fetch<EmbeddingApiResponse>(config.public.api_base + "/pymark/embed_gray", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + config.public.token,
            },
            body: formData,
        });

        responseData.value = response;
        console.log(response);
        formSubtmitting.value = false;
    } catch (error) {
        console.error("Error:", error);
    }
}
</script>
~/types/EmbeddingApiResponse
