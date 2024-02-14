<template>
    <div class="p-4">
        <h1 class="text-2xl font-bold mb-4">Pymark Extraction</h1>
        <form @submit.prevent="submitForm" class="space-y-4" enctype="multipart/form-data">
            <!-- watermarked and block position section input -->
            <div class="flex flex-col md:flex-row md:items-end">
                <ImageInput class="md:me-1 md:w-full" v-model="watermarked_image" id="watermarked_image" label="Watermarked Image" :formSubmitted="formSubmitted" />
                <ImageInput class="md:ms-1 md: md:w-full" v-model="block_position" id="block_position" label="Block Position" :formSubmitted="formSubmitted" />
            </div>
            <!-- alert of watermarked and block position -->
            <div class="flex flex-col md:flex-row" style="margin: 0">
                <div class="md:w-1/2">
                    <span v-if="formSubmitted && !watermarked_image" class="text-red-500">Watermarked image is required</span>
                </div>
                <div class="md:w-1/2">
                    <span v-if="formSubmitted && !block_position" class="text-red-500">Block position image is required</span>
                </div>
            </div>
            <!-- watermark and npy file section input -->
            <div class="flex flex-col md:flex-row md:items-end">
                <ImageInput class="md:me-1 md:w-full" v-model="watermark_image" id="watermark_image" label="Watermark Image (Opsional, required if you wanna get the analysis result)" :formSubmitted="formSubmitted" />
                <FileInput class="md:ms-1 md:w-full" v-model="key_matrix" label="Key Matrix (.npy)" :formSubmitted="formSubmitted" :fileType="'.npy'" />
            </div>
            <!-- alert seection for key matrix -->
            <div class="flex flex-col md:flex-row md:items-end" style="margin: 0">
                <div class="md:w-1/2"></div>
                <div class="md:w-1/2">
                    <span v-if="formSubmitted && !key_matrix" class="text-red-500">Key Matrix (.npy) is required</span>
                </div>
            </div>
            <div class="flex flex-col">
                <DropdownInput v-model="type" label="type" :options="typeOptions" />
                <span v-if="formSubmitted && !type" class="text-red-500">Image Type is required</span>
            </div>
            <div class="flex flex-col">
                <DropdownInput v-model="alpha" label="alpha" :options="alphaOptions" />
                <span v-if="formSubmitted && !alpha" class="text-red-500">Alpha is required</span>
            </div>
            <FileSharingSubmit class="!mt-5">{{ formSubtmitting ? "submitting" : "submit" }}</FileSharingSubmit>
        </form>

        <!-- Bagian untuk menampilkan preview dari respons API -->
        <div class="mt-5" v-if="responseData && responseData.data">
            <h2 class="text-2xl font-bold mb-4">Hasil dari Respons API</h2>
            <div>
                <p class="mb-2">Folder Result: {{ responseData.data.folder_result }}</p>
                <div v-if="responseData.data.robustness_analysis" class="mb-4">
                    <p class="text-xl font-bold">Robustness Analysis:</p>
                    <ul>
                        <li>BER: {{ responseData.data.robustness_analysis.ber }}</li>
                        <li>NCC: {{ responseData.data.robustness_analysis.ncc }}</li>
                    </ul>
                </div>
            </div>
            <div v-if="responseData.data.uploaded_file_responses">
                <div class="mt-6">
                    <div v-if="responseData.data.uploaded_file_responses">
                        <h2 class="text-xl font-bold mb-4">Preview Gambar Extracted Watermark</h2>
                        <div class="overflow-hidden">
                            <img :src="responseData.data.uploaded_file_responses.extracted_watermark.thumbnail_link.replace(/=s\d+$/, '')" alt="Preview Extracted Watermark" />
                            <div class="p-4">
                                <a :href="responseData.data.uploaded_file_responses.extracted_watermark.web_view_link" target="_blank" class="text-blue-500 hover:underline">View Extracted Watermark</a>
                            </div>
                        </div>

                        <div>
                            <h2 class="text-xl font-bold mb-4">Link Lainnya</h2>
                            <ul class="list-disc list-inside">
                                <li><a :href="responseData.data.uploaded_file_responses.block_position.web_view_link" target="_blank" class="text-blue-500 hover:underline">View Block Position</a></li>
                                <li><a :href="responseData.data.uploaded_file_responses.embedding_result_zip.web_view_link" target="_blank" class="text-blue-500 hover:underline">View Embedding Result Zip</a></li>
                                <li><a :href="responseData.data.uploaded_file_responses.extracted_watermark.web_view_link" target="_blank" class="text-blue-500 hover:underline">View Extracted Watermark</a></li>
                                <li><a :href="responseData.data.uploaded_file_responses.key_matrix.web_view_link" target="_blank" class="text-blue-500 hover:underline">View Key Matrix</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type ExtractionApiResponse from "~/types/ExtractionApiResponse";
import { useToast } from "vue-toastification";

definePageMeta({
    layout: "filesharing",
    middleware: ["auth-filesharing"],
});

const filesharing = useFileSharingStore();
const config = useRuntimeConfig();

const formSubmitted = ref(false);
const formSubtmitting = ref(false);
const watermark_image = ref<File | null>(null);
const watermarked_image = ref<File | null>(null);
const block_position = ref<File | null>(null);
const key_matrix = ref<File | null>(null); // Tambahkan variabel untuk file .npy
const type = ref("gray");
const alpha = ref("0.01");
const responseData = ref<ExtractionApiResponse | null>(null);
const requestLoadingElement = ref<HTMLElement | null>(null);

const typeOptions = ["gray", "rgb"];
const alphaOptions = ["0.01", "0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8", "0.9"];

onMounted(() => {
    const element = document.getElementById("loading_submit_request");

    if (element) {
        requestLoadingElement.value = element as HTMLElement;
    }
});

function validateForm() {
    return {
        watermarked_image: !!watermarked_image.value,
        block_position: !!block_position.value,
        key_matrix: !!key_matrix.value,
        type: !!type.value,
        alpha: !!alpha.value,
    };
}

async function submitForm() {
    const h1Element = requestLoadingElement.value?.querySelector("h1");

    if (h1Element) {
        // Check if the h1 element exists
        h1Element.textContent = "Extraction process is running";
    }

    requestLoadingElement.value?.classList.remove("hidden");
    formSubmitted.value = true;
    formSubtmitting.value = true;
    responseData.value = null;

    const validations = validateForm();

    const isValid = Object.values(validations).every((field) => field);
    if (!isValid) {
        formSubtmitting.value = false;
        requestLoadingElement.value?.classList.add("hidden");
        return;
    }

    // Scroll to the loading element
    if (requestLoadingElement.value) {
        requestLoadingElement.value.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    const formData = new FormData();
    if (watermark_image.value) formData.append("watermark_image", watermark_image.value);
    if (watermarked_image.value) formData.append("watermarked_image", watermarked_image.value);
    if (block_position.value) formData.append("block_position", block_position.value);
    // Mengirim key_matrix
    if (key_matrix.value) formData.append("key_matrix", key_matrix.value);
    formData.append("alpha", alpha.value.toString());

    try {
        const response = await $fetch<ExtractionApiResponse>(config.public.api_base + "/pymark/extract_" + type.value, {
            method: "POST",
            headers: {
                Authorization: "Bearer " + filesharing.userJWTToken,
            },
            body: formData,
        });

        responseData.value = response;
        useToast().success(response.message);
    } catch (error: any) {
        useToast().error(error.response._data.message);
    }

    formSubtmitting.value = false;
    requestLoadingElement.value?.classList.add("hidden");
}
</script>
