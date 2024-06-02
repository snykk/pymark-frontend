<template>
    <div class="px-4 relative">
        <h1 class="text-2xl font-bold mb-4">
            Pymark Extraction
            <UserGuideButton @click="showUserGuideModal" />
        </h1>
        <form @submit.prevent="submitForm" class="space-y-4" enctype="multipart/form-data">
            <!-- watermarked and block position section input -->
            <div class="flex flex-col md:flex-row md:items-end">
                <div class="md:me-1 md:w-full">
                    <ImageInput :key="fileInputKey" v-model="watermarked_image" id="watermarked_image" label="Watermarked Image" :formSubmitted="formSubmitted" />
                    <span v-if="formSubmitted && !watermarked_image" class="text-red-500">Watermarked image is required</span>
                </div>
                <div class="md:ms-1 md: md:w-full">
                    <ImageInput :key="fileInputKey" v-model="block_position" id="block_position" label="Block Position" :formSubmitted="formSubmitted" />
                    <span v-if="formSubmitted && !block_position" class="text-red-500">Block position image is required</span>
                </div>
            </div>
            <!-- alert of watermarked and block position -->
            <div class="flex flex-col md:flex-row" style="margin: 0">
                <div class="md:w-1/2"></div>
                <div class="md:w-1/2"></div>
            </div>
            <!-- watermark and npy file section input -->
            <div class="flex flex-col md:flex-row md:items-end">
                <ImageInput :key="fileInputKey" class="md:me-1 md:w-full" v-model="watermark_image" id="watermark_image" label="Watermark Image (Opsional, required if you wanna get the analysis result)" :formSubmitted="formSubmitted" />
                <FileInput :key="fileInputKey" class="md:ms-1 md:w-full" v-model="key_matrix" label="Key Matrix (.npy)" :formSubmitted="formSubmitted" :fileType="'.npy'" />
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
            <FileSharingSubmit :disabled="formSubtmitting" class="!mt-5">{{ formSubtmitting ? "submitting" : "submit" }}</FileSharingSubmit>
        </form>

        <!-- Bagian untuk menampilkan preview dari respons API -->
        <div class="mt-5 space-y-4 bg-slate-100 dark:bg-gray-800 p-4 rounded-lg" v-if="responseData && responseData.data">
            <h2 class="text-2xl font-bold">Extraction Result</h2>
            <div>
                <div class="mb-2">
                    <p class="">Folder ID: {{ responseData.data.folder_id }}</p>
                    <p class="">Folder Name: {{ responseData.data.folder_result }}</p>
                </div>
                <div v-if="responseData.data.robustness_analysis" class="">
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
                        <h2 class="text-xl font-bold mb-2">Preview Gambar Extracted Watermark</h2>
                        <div class="overflow-hidden">
                            <a :href="responseData.data.uploaded_file_responses.extracted_watermark.web_view_link" target="_blank" class="text-blue-500 hover:underline">
                                <img :src="responseData.data.uploaded_file_responses.extracted_watermark.thumbnail_link.replace(/=s\d+$/, '')" alt="Preview Extracted Watermark" class="rounded-lg" />
                            </a>
                            <div class="p-4"></div>
                        </div>

                        <div>
                            <h2 class="text-xl font-bold">Link Lainnya</h2>
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

            <NavToMyDrive :to="'/file-sharing/my_drive/folders/' + responseData.data.folder_id" />
        </div>

        <!-- PyMark Extraction User Guide Modal -->
        <div v-if="showUserGuide" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                <button @click="hideUserGuideModal" class="absolute top-3 right-3 text-gray-500 dark:text-gray-400 focus:outline-none">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>

                <div class="relative bg-gray-50 dark:bg-gray-800 w-full max-w-[80vw] p-6 rounded-lg shadow-lg overflow-y-auto max-h-[80vh] text-justify text-align-last-justify">
                    <h2 class="text-xl font-bold mb-4">PyMark Extraction User Guide</h2>
                    <p>
                        PyMark Extraction is a feature that allows you to extract a watermark from a watermarked image using the PyMark algorithm. This process involves analyzing the watermarked image along with the block positions to
                        recover the embedded watermark.
                    </p>
                    <p class="mb-4">Here's a guide on how to use the PyMark Extraction feature:</p>
                    <ol class="list-decimal list-inside mb-4">
                        <li class="mb-2">Upload the watermarked image (1024x1024) and the block position image (256x256).</li>
                        <li class="mb-2">Optionally, upload the watermark image if you want to obtain the analysis result.</li>
                        <li class="mb-2">Select the type of image (type) from the dropdown.</li>
                        <li class="mb-2">Select the alpha value from the dropdown. this value must be the same as those used in the embedding process</li>
                        <li class="mb-2">Click the Submit button to start the extraction process.</li>
                    </ol>
                    <p class="">After submission, you will see the extraction result, robustness analysis (if available), preview of the extracted watermark, and other related links.</p>
                </div>
            </div>
        </div>

        <!-- back to top button -->
        <BackToTopButton />
        <!-- reset button -->
        <ResetButton v-if="isFormDirty && !formSubtmitting" @click="resetForm" />
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
const fileInputKey = ref(0);
const showUserGuide = ref(false);

const typeOptions = ["gray", "rgb"];
const alphaOptions = ["0.01", "0.02", "0.03", "0.04", "0.05", "0.06", "0.07", "0.08", "0.09", "0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8", "0.9"];

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

const isFormDirty = computed(() => {
    return watermarked_image.value !== null || block_position.value !== null || key_matrix.value !== null || type.value !== "gray" || alpha.value !== "0.01";
});

const resetForm = () => {
    watermarked_image.value = null;
    block_position.value = null;
    key_matrix.value = null;
    watermark_image.value = null;
    type.value = "gray";
    alpha.value = "0.01";
    responseData.value = null;

    fileInputKey.value += 1;
    formSubmitted.value = false;
};

function showUserGuideModal() {
    showUserGuide.value = true;
}

function hideUserGuideModal() {
    showUserGuide.value = false;
}
</script>
