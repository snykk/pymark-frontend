<template>
    <div class="px-4 relative">
        <h1 class="text-2xl font-bold mb-4 relative">
            Pymark Embedding
            <UserGuideButton @click="showUserGuideModal" />
        </h1>
        <form @submit.prevent="submitForm" class="space-y-4" enctype="multipart/form-data">
            <div class="flex flex-col md:flex-row items-end">
                <div class="md:me-2 w-full md:w-1/2">
                    <ImageInput :key="imageInputKey" v-model="host_image" id="host_image" label="Host Image" :formSubmitted="formSubmitted" />
                    <span v-if="formSubmitted && !host_image" class="text-red-500">Host image is required</span>
                </div>
                <div class="md:ms-2 w-full md:w-1/2">
                    <ImageInput :key="imageInputKey" v-model="watermark_image" id="watermark_image" label="Watermark Image" :formSubmitted="formSubmitted" />
                    <span v-if="formSubmitted && !watermark_image" class="text-red-500">Watermark image is required</span>
                </div>
            </div>
            <div class="flex flex-col">
                <DropdownInput v-model="type" label="type" :options="typeOptions" />
            </div>
            <div class="flex flex-col">
                <DropdownInput v-model="alpha" label="alpha" :options="alphaOptions" />
            </div>

            <FileSharingSubmit :disabled="formSubtmitting" class="!mt-5">{{ formSubtmitting ? "submitting" : "submit" }}</FileSharingSubmit>
        </form>

        <!-- Bagian untuk menampilkan preview dari respons API -->
        <div class="mt-5 space-y-4 bg-slate-100 dark:bg-gray-800 p-4 rounded-lg mb-10 relative" v-if="responseData && responseData.data">
            <h2 class="text-2xl font-bold">Embedding Result</h2>
            <div v-if="responseData.data.uploaded_file_responses" class="space-y-4">
                <div class="mb-2">
                    <p class="">Folder ID: {{ responseData.data.folder_id }}</p>
                    <p class="">Folder Name: {{ responseData.data.folder_result }}</p>
                </div>
                <div class="space-y-1">
                    <h2 class="text-xl font-bold">Imperceptibility Analysis</h2>
                    <p>PSNR (Peak Signal-to-Noise Ratio): {{ responseData.data.imperceptibility_analysis.psnr }}</p>
                    <p>SSIM (Structural Similarity Index): {{ responseData.data.imperceptibility_analysis.ssim }}</p>
                </div>

                <h3 class="text-xl font-bold">Watermarked Image Preview</h3>
                <div class="rounded-lg overflow-hidden">
                    <a :href="responseData.data.uploaded_file_responses.watermarked_image.web_view_link" target="_blank" class="text-blue-500 hover:underline">
                        <img :src="responseData.data.uploaded_file_responses.watermarked_image.thumbnail_link.replace(/=s\d+$/, '')" alt="Preview Watermarked Image" />
                    </a>
                </div>
                <div>
                    <h4 class="text-xl font-bold">Other Links</h4>
                    <ul class="list-disc list-inside">
                        <li><a :href="responseData.data.uploaded_file_responses.public_compressed_image.web_view_link" target="_blank" class="text-blue-500 hover:underline">View Public Compressed Image</a></li>
                        <li><a :href="responseData.data.uploaded_file_responses.block_position.web_view_link" target="_blank" class="text-blue-500 hover:underline">View Block Position</a></li>
                        <li><a :href="responseData.data.uploaded_file_responses.embedding_result_zip.web_view_link" target="_blank" class="text-blue-500 hover:underline">View Embedding Result Zip</a></li>
                        <li><a :href="responseData.data.uploaded_file_responses.key_matrix.web_view_link" target="_blank" class="text-blue-500 hover:underline">View Key Matrix</a></li>
                    </ul>
                </div>
            </div>

            <NavToMyDrive :to="'/file-sharing/my_drive/folders/' + responseData.data.folder_id" />
        </div>

        <!-- PyMark Embedding User Guide Modal -->
        <div v-if="showUserGuide" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                <button @click="hideUserGuideModal" class="absolute top-3 right-3 text-gray-500 dark:text-gray-400 focus:outline-none">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>

                <div class="relative bg-gray-50 dark:bg-gray-800 w-full max-w-[80vw] p-6 rounded-lg shadow-lg overflow-y-auto max-h-[80vh] text-justify text-align-last-justify">
                    <h2 class="text-xl font-bold mb-4">PyMark Embedding User Guide</h2>
                    <p class="mb-4">
                        PyMark Embedding is a feature that allows you to embed a watermark into a host image using the PyMark algorithm. This process involves merging the watermark image with the host image in a way that the watermark
                        becomes imperceptible to the human eye while retaining its integrity for extraction later.
                    </p>
                    <p class="mb-4">Here's a guide on how to use the PyMark Embedding feature:</p>
                    <ol class="list-decimal list-inside mb-4">
                        <li class="mb-1">Fill in the required fields: Host Image (1024x1024) and Watermark Image (256x256).</li>
                        <li class="mb-1">Ensure the host image is 4 times larger than the watermark image in dimensions.</li>
                        <li class="mb-1">Choose the type of embedding (type) from the dropdown.</li>
                        <li class="mb-1">Select the alpha value from the dropdown (recommended value is 0.05).</li>
                        <li class="mb-1">Click the Submit button to start the embedding process.</li>
                    </ol>
                    <p class="">After submission, you will see the embedding result, imperceptibility analysis, watermarked image preview, and other related links.</p>
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
import type EmbeddingApiResponse from "~/types/EmbeddingApiResponse";
import { useToast } from "vue-toastification";

definePageMeta({
    layout: "filesharing",
    middleware: ["auth-filesharing"],
});

const filesharing = useFileSharingStore();
const config = useRuntimeConfig();

const formSubmitted = ref(false);
const formSubtmitting = ref(false);
const host_image = ref<File | null>(null);
const watermark_image = ref<File | null>(null);
const type = ref("gray");
const alpha = ref("0.01");
const responseData = ref<EmbeddingApiResponse | null>(null);
const requestLoadingElement = ref<HTMLElement | null>(null);
const imageInputKey = ref(0);
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
        host_image: !!host_image.value,
        watermark_image: !!watermark_image.value,
        type: !!type.value,
        alpha: !!alpha.value,
    };
}

async function submitForm() {
    const h1Element = requestLoadingElement.value?.querySelector("h1");

    if (h1Element) {
        // Check if the h1 element exists
        h1Element.textContent = "Embedding process is running";
    }

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
        useToast().success(response.message);
    } catch (error: any) {
        useToast().error(error.response._data.message);
    }

    formSubtmitting.value = false;
    requestLoadingElement.value?.classList.add("hidden");
}

const isFormDirty = computed(() => {
    return host_image.value !== null || watermark_image.value !== null || type.value !== "gray" || alpha.value !== "0.01";
});

const resetForm = () => {
    host_image.value = null;
    watermark_image.value = null;
    type.value = "gray";
    alpha.value = "0.01";
    responseData.value = null;

    imageInputKey.value += 1;
    formSubmitted.value = false;
};

function showUserGuideModal() {
    showUserGuide.value = true;
}

function hideUserGuideModal() {
    showUserGuide.value = false;
}
</script>
