<template>
    <div class="px-4">
        <h1 class="text-2xl font-bold mb-4">Pymark Embedding</h1>
        <form @submit.prevent="submitForm" class="space-y-4" enctype="multipart/form-data">
            <div class="flex flex-col md:flex-row items-end">
                <ImageInput class="md:me-2 w-full md:w-1/2" v-model="host_image" id="host_image" label="Host Image" :formSubmitted="formSubmitted" />
                <ImageInput class="md:ms-2 w-full md:w-1/2" v-model="watermark_image" id="" label="Watermark Image" :formSubmitted="formSubmitted" />
            </div>
            <div class="flex flex-col md:flex-row" style="margin: 0">
                <div class="md:me-2 md:w-1/2">
                    <span v-if="formSubmitted && !host_image" class="text-red-500">Host image is required</span>
                </div>
                <div class="md:ms-2 md:w-1/2">
                    <span v-if="formSubmitted && !watermark_image" class="text-red-500">Watermark image is required</span>
                </div>
            </div>
            <div class="flex flex-col">
                <DropdownInput v-model="type" label="type" :options="typeOptions" />
            </div>
            <div class="flex flex-col">
                <DropdownInput v-model="alpha" label="alpha" :options="alphaOptions" />
            </div>

            <FileSharingSubmit class="!mt-5">{{ formSubtmitting ? "submitting" : "submit" }}</FileSharingSubmit>
        </form>
        <!-- Bagian untuk menampilkan preview dari respons API -->
        <div class="mt-6" v-if="responseData && responseData.data">
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

const typeOptions = ["gray", "rgb"];
const type = ref("gray");

const alphaOptions = ["0.01", "0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8", "0.9"];
const alpha = ref("0.01");

var responseData = ref<EmbeddingApiResponse | null>(null);

const requestLoadingElement = ref<HTMLElement | null>(null);

onMounted(() => {
    const element = document.getElementById("request_loading");

    if (element) {
        requestLoadingElement.value = element as HTMLElement;
    }
});

function validateForm() {
    return {
        host_image: !!host_image.value,
        watermark_image: !!watermark_image.value,
        type: !!type.value,
        alpha: !!alpha.value,
    };
}

async function submitForm() {
    requestLoadingElement.value?.classList.remove("hidden");
    formSubmitted.value = true;
    formSubtmitting.value = true;
    responseData.value = null;

    const validations = validateForm();

    const isValid = Object.values(validations).every((field) => field);
    if (!isValid) {
        formSubtmitting.value = false;
        // Handle error messages or prevent form submission
        requestLoadingElement.value?.classList.add("hidden");
        return;
    }

    // Scroll to the loading element
    if (requestLoadingElement.value) {
        requestLoadingElement.value.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    const formData = new FormData();

    if (host_image.value) formData.append("host_image", host_image.value);
    if (watermark_image.value) formData.append("watermark_image", watermark_image.value);
    formData.append("alpha", alpha.value.toString());

    try {
        const response = await $fetch<EmbeddingApiResponse>(config.public.api_base + "/pymark/embed_" + type.value, {
            method: "POST",
            headers: {
                Authorization: "Bearer " + filesharing.userJWTToken,
            },
            body: formData,
        });

        responseData.value = response;
    } catch (error) {
        console.error("Error:", error);
    }

    formSubtmitting.value = false;
    requestLoadingElement.value?.classList.add("hidden");
}
</script>
