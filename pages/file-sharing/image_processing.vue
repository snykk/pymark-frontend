<template>
    <div class="p-4">
        <h1 class="text-2xl font-bold mb-4">Form Pymark Image Processing</h1>
        <form @submit.prevent="submitForm" class="space-y-4" enctype="multipart/form-data">
            <div class="flex flex-col">
                <label for="image" class="mb-1">Image</label>
                <input type="file" id="image" accept="image/*" ref="fileInput1" style="display: none" @change="handleImageChange($event)" class="p-2 border rounded" />
                <div class="flex items-center">
                    <label for="image" class="cursor-pointer bg-gray-200 p-2 rounded">Select Image</label>
                    <img v-if="imagePreviews" :src="imagePreviews" class="ml-4 h-20" alt="Preview Image 1" />
                </div>
                <span v-if="formSubmitted && !image" class="text-red-500">Host Image is required</span>
            </div>
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
                            <div class="flex">
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

            <div class="flex justify-center">
                <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">{{ formSubtmitting ? "submitting" : "submit" }}</button>
            </div>
        </form>
        <!-- API Response Display Section -->
        <div v-if="responseData">
            <div class="border rounded-lg p-6 bg-white shadow-lg mt-8">
                <!-- API Response Details -->
                <h2 class="text-lg font-semibold mb-4">API Response:</h2>
                <!-- Attacked Image Preview -->
                <div v-if="responseData.data && responseData.data.uploaded_file_responses.attacked_image">
                    <h4 class="text-sm font-semibold mb-2">Attacked Image Preview:</h4>
                    <div class="rounded-lg shadow-md overflow-hidden attacked-image-container">
                        <img :src="responseData.data.uploaded_file_responses.attacked_image.download_link" alt="Attacked Image" />
                    </div>
                </div>
                <!-- Detailed Response Data -->
                <div class="mt-6">
                    <p class="text-sm font-semibold">Status: {{ responseData.status }}</p>
                    <p class="mt-2">{{ responseData.message }}</p>

                    <div v-if="responseData.data">
                        <h3 class="text-md font-semibold mt-4">Folder Result: {{ responseData.data.folder_result }}</h3>
                        <!-- Uploaded File Responses -->
                        <div v-if="responseData.data.uploaded_file_responses">
                            <h4 class="text-sm font-semibold mt-4">Uploaded File Responses:</h4>
                            <div v-for="(fileResponse, key) in responseData.data.uploaded_file_responses" :key="key" class="mt-2 border rounded p-4 bg-gray-100">
                                <p class="font-semibold text-blue-600">File: {{ key }}</p>
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
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const filesharing = useFileSharingStore();

definePageMeta({
    layout: "filesharing",
    middleware: ["auth-filesharing"],
});

import type { ImageProcessingApiResponse } from "~/types/ImageProcessingResponse";
import { ProcessingParameters } from "~/types/ProcessingParameters";

// List of processing types
const processingTypeOptions = ["salt_and_pepper", "blur", "gaussian", "sharpening", "median", "cropping", "jpeg_compression"];
const processingType = ref<string>("salt_and_pepper"); // Default selected processing type

const config = useRuntimeConfig();

const formSubmitted = ref(false);
const formSubtmitting = ref(false);

const image = ref<File | null>(null);
const imagePreviews = ref<string | null>(null);

var responseData = ref<ImageProcessingApiResponse | null>(null);

function handleImageChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target || !target.files) return;

    const file = target.files[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
            image.value = file;
            imagePreviews.value = result;
        }
    };
    fileReader.readAsDataURL(file);
}

function validateForm() {
    return {
        image: !!image.value,
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
        formSubtmitting.value = false;
    } catch (error) {
        console.error("Error:", error);
    }
}
</script>

<style lang="css" scoped>
/* Your existing custom styles... */

/* Adjustments for better layout */
.input-field {
    margin-bottom: 1.5rem;
}

/* Styling for Attacked Image */
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
