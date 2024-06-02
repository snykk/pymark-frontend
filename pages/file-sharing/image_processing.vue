<template>
    <div class="p-4 relative">
        <h1 class="text-2xl font-bold mb-4">
            Pymark Image Processing
            <UserGuideButton @click="showUserGuideModal" />
        </h1>
        <form @submit.prevent="submitForm" class="space-y-4" enctype="multipart/form-data">
            <div class="flex flex-col w-full">
                <ImageInput :key="imageInputKey" class="md:me-1 w-full" v-model="image" id="image" label="Original Image" :formSubmitted="formSubmitted" />
            </div>
            <span v-if="formSubmitted && !image" class="text-red-500">Original Image is required</span>
            <!-- Add a dropdown/select field for processing type -->
            <div class="flex flex-col">
                <DropdownInput v-model="processingType" label="processintType" :options="processingTypeOptions" />
            </div>

            <div v-if="processingType !== ''">
                <div v-if="processingType === 'cropping'">
                    <h3 class="text-lg font-semibold mt-4">{{ processingType }} Parameters:</h3>
                    <div v-for="(param, index) in ProcessingParameters[processingType]" :key="index" class="flex flex-col">
                        <label :for="`cropping_type`" class="mb-1">Crop Type</label>
                        <select
                            :id="`cropping_type`"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                            <option value="inner">Inner</option>
                            <option value="outer">Outer</option>
                        </select>
                        <div class="mt-2">
                            <label class="mb-1">Crop Edge (left, top, righ, bottom)</label>
                            <div class="flex space-x-1 lg:space-x-5 md:space-x-2">
                                <NumberInput id="cropping_edge_left" placeholder="left" />
                                <NumberInput id="cropping_edge_top" placeholder="Top" />
                                <NumberInput id="cropping_edge_right" placeholder="Right" />
                                <NumberInput id="cropping_edge_bottom" placeholder="Bottom" />
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else>
                    <h3 class="text-md font-semibold mt-4 capitalize">{{ processingType }} Parameters:</h3>
                    <div v-if="ProcessingParameters[processingType]">
                        <div v-for="(param, index) in ProcessingParameters[processingType]" :key="index" class="flex flex-col">
                            <label :for="`${processingType}_param_${index}`" class="block mb-2 text-sm font-medium">{{ param.label }}</label>
                            <select
                                :id="`${processingType}_param_${index}`"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            >
                                <option v-for="(value, vIndex) in param.values" :key="vIndex" :value="[value]">
                                    {{ value }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <FileSharingSubmit :disabled="formSubtmitting" class="!mt5">{{ formSubtmitting ? "submitting" : "submit" }}</FileSharingSubmit>
        </form>

        <!-- API Response Display Section -->
        <div v-if="responseData" class="space-y-4 bg-slate-100 dark:bg-gray-800 p-4 rounded-lg mt-5">
            <!-- API Response Details -->
            <h2 class="text-2xl font-bold">Image Processing Result</h2>
            <div class="mb-2">
                <p class="">Folder ID: {{ responseData.data.folder_id }}</p>
                <p class="">Folder Name: {{ responseData.data.folder_result }}</p>
            </div>

            <!-- Attacked Image Preview -->
            <div class="space-y-2" v-if="responseData.data && responseData.data.uploaded_file_responses.attacked_image">
                <h3 class="text-xl font-bold">Attacked Image Preview</h3>
                <div class="rounded-lg overflow-hidden">
                    <a :href="responseData.data.uploaded_file_responses.attacked_image.web_view_link" target="_blank" class="text-blue-500 hover:underline attacked-image-container">
                        <img :src="responseData.data.uploaded_file_responses.attacked_image.thumbnail_link.replace(/=s\d+$/, '')" alt="Attacked Image" />
                    </a>
                </div>
            </div>
            <!-- Detailed Response Data -->
            <div class="mt-6">
                <div v-if="responseData.data">
                    <!-- Uploaded File Responses -->
                    <div v-if="responseData.data.uploaded_file_responses">
                        <h4 class="font-bold mt-4">Uploaded File Responses:</h4>
                        <div v-for="(fileResponse, key) in responseData.data.uploaded_file_responses" :key="key" class="mt-2">
                            <p class="font-bold">File: {{ key }}</p>
                            <p>
                                Download Link: <a :href="fileResponse.download_link" target="_blank" class="text-blue-500">{{ fileResponse.download_link }}</a>
                            </p>
                            <p>
                                Web View Link: <a :href="fileResponse.web_view_link" target="_blank" class="text-blue-500">{{ fileResponse.web_view_link }}</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <NavToMyDrive :to="'/file-sharing/my_drive/folders/' + responseData.data.folder_id" />
        </div>

        <!-- PyMark Image Processing User Guide Modal -->
        <div v-if="showUserGuide" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                <button @click="hideUserGuideModal" class="absolute top-3 right-3 text-gray-500 dark:text-gray-400 focus:outline-none">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>

                <div class="relative bg-gray-50 dark:bg-gray-800 w-full max-w-[80vw] p-6 rounded-lg shadow-lg overflow-y-auto max-h-[80vh] text-justify text-align-last-justify">
                    <h2 class="text-xl font-bold mb-4">PyMark Image Processing User Guide</h2>
                    <p class="mb-4">
                        PyMark Image Processing is a feature that allows you to process images using various algorithms available in the PyMark Watermarking. This process involves applying selected image processing techniques to enhance,
                        modify, or analyze images according to your requirements.
                    </p>
                    <p class="mb-4">Here's a guide on how to use the PyMark Image Processing feature:</p>
                    <ol class="list-decimal list-inside mb-4">
                        <li class="mb-1">Upload the original image that you want to process.</li>
                        <li class="mb-1">Select the type of processing technique from the dropdown menu.</li>
                        <li class="mb-1">Based on the selected processing technique, provide the required parameters.</li>
                        <li class="mb-1">Click the Submit button to start the image processing.</li>
                    </ol>
                    <p class="">After submission, you will see the image processing result along with relevant details and preview of the processed image.</p>
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
import type ImageProcessingApiResponse from "~/types/ImageProcessingResponse";
import { ProcessingParameters } from "~/types/ProcessingParameters";
import { useToast } from "vue-toastification";

definePageMeta({
    layout: "filesharing",
    middleware: ["auth-filesharing"],
});

const filesharing = useFileSharingStore();
const config = useRuntimeConfig();

const processingTypeOptions = ["salt_and_pepper", "blur", "gaussian", "sharpening", "median", "cropping", "jpeg_compression"];
const processingType = ref<string>("salt_and_pepper"); // Default selected processing type
const formSubmitted = ref(false);
const formSubtmitting = ref(false);
const image = ref<File | null>(null);
const responseData = ref<ImageProcessingApiResponse | null>(null);
const requestLoadingElement = ref<HTMLElement | null>(null);
const imageInputKey = ref(0);
const showUserGuide = ref(false);

function validateForm() {
    return {
        image: !!image.value,
    };
}

onMounted(() => {
    const element = document.getElementById("loading_submit_request");

    if (element) {
        requestLoadingElement.value = element as HTMLElement;
    }
});

async function submitForm() {
    const h1Element = requestLoadingElement.value?.querySelector("h1");

    if (h1Element) {
        // Check if the h1 element exists
        h1Element.textContent = "Image processing is running";
    }

    requestLoadingElement.value?.classList.remove("hidden");
    formSubmitted.value = true;
    formSubtmitting.value = true;
    responseData.value = null;

    const validations = validateForm();

    const isValid = Object.values(validations).every((field) => field);
    if (!isValid) {
        requestLoadingElement.value?.classList.add("hidden");
        formSubtmitting.value = false;
        return;
    }

    // Scroll to the loading element
    if (requestLoadingElement.value) {
        requestLoadingElement.value.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    const formData = new FormData();

    if (image.value) formData.append("image", image.value);

    // Append the selected processing type to formData
    formData.append("processing_type", processingType.value);

    // Loop through the processing parameters and append their values to formData
    if (processingType.value === "cropping") {
        formData.append("cropping_type", (document.getElementById("cropping_type") as HTMLSelectElement).value);
        formData.append("cropping_edge_left", (document.getElementById("cropping_edge_left") as HTMLSelectElement).value);
        formData.append("cropping_edge_top", (document.getElementById("cropping_edge_top") as HTMLSelectElement).value);
        formData.append("cropping_edge_right", (document.getElementById("cropping_edge_right") as HTMLSelectElement).value);
        formData.append("cropping_edge_bottom", (document.getElementById("cropping_edge_bottom") as HTMLSelectElement).value);
    } else if (ProcessingParameters[processingType.value]) {
        ProcessingParameters[processingType.value].forEach((param: any, index: any) => {
            const selectElement = document.getElementById(`${processingType.value}_param_${index}`) as HTMLSelectElement;
            const selectedValue = selectElement.value;
            formData.append(`${processingType.value}_${param.label}`, selectedValue);
        });
    }

    try {
        const response = await $fetch<ImageProcessingApiResponse>(config.public.api_base + "/pymark/image_processing", {
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
    return image.value !== null || processingType.value !== "salt_and_pepper";
});

const resetForm = () => {
    image.value = null;
    processingType.value = "salt_and_pepper";
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

<style lang="css" scoped>
.input-field {
    margin-bottom: 1.5rem;
}

.attacked-image-container {
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.attacked-image-container img {
    width: 100%;
    height: auto;
}
</style>
