<template>
    <div class="p-4">
        <div>
            <h1 class="text-2xl font-bold mb-4">Form Imperceptibility Analysis</h1>
            <form @submit.prevent="submitImperceptibilityForm" class="space-y-4" enctype="multipart/form-data">
                <div class="flex flex-col">
                    <label for="host_image" class="mb-1">Host Image</label>
                    <input type="file" id="host_image" accept="image/*" ref="fileInput1" style="display: none" @change="handleImageChange(1, $event)" class="p-2 border rounded" />
                    <div class="flex items-center">
                        <label for="host_image" class="cursor-pointer bg-gray-200 p-2 rounded">Select Image 1</label>
                        <img v-if="imagePreviews[0]" :src="imagePreviews[0]" class="ml-4 h-20" alt="Preview Image 1" />
                    </div>
                    <span v-if="formImperceptSubmitted && !host_image" class="text-red-500">Host Image is required</span>
                </div>
                <div class="flex flex-col">
                    <label for="watermarked_image" class="mb-1">Watermarked Image</label>
                    <input type="file" id="watermarked_image" accept="image/*" ref="fileInput2" style="display: none" @change="handleImageChange(2, $event)" class="p-2 border rounded" />
                    <div class="flex items-center">
                        <label for="watermarked_image" class="cursor-pointer bg-gray-200 p-2 rounded">Select Image 2</label>
                        <img v-if="imagePreviews[1]" :src="imagePreviews[1]" class="ml-4 h-20" alt="Preview Image 2" />
                    </div>
                    <span v-if="formImperceptSubmitted && !watermarked_image" class="text-red-500">Watermarked Image is required</span>
                </div>
                <div class="flex justify-center">
                    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">{{ formSubtmitting ? "submitting" : "submit" }}</button>
                </div>
            </form>
            <!-- Imperceptibility Analysis Response -->
            <div v-if="imperceptibilityResponseData" class="mt-8">
                <h2 class="text-xl font-bold mb-2">Imperceptibility Analysis Response</h2>
                <div class="bg-gray-100 p-4 rounded">
                    <div v-if="imperceptibilityResponseData.data">
                        <p>PSNR: {{ imperceptibilityResponseData.data.imperceptibility_analysis.psnr }}</p>
                        <p>SSIM: {{ imperceptibilityResponseData.data.imperceptibility_analysis.ssim }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <h1 class="text-2xl font-bold mb-4">Form Robustness Analysis</h1>
            <form @submit.prevent="submitRobustnessForm" class="space-y-4" enctype="multipart/form-data">
                <div class="flex flex-col">
                    <label for="watermark_image" class="mb-1">Watermark Image</label>
                    <input type="file" id="watermark_image" accept="image/*" ref="fileInput1" style="display: none" @change="handleImageChange(3, $event)" class="p-2 border rounded" />
                    <div class="flex items-center">
                        <label for="watermark_image" class="cursor-pointer bg-gray-200 p-2 rounded">Select Image 1</label>
                        <img v-if="imagePreviews[2]" :src="imagePreviews[2]" class="ml-4 h-20" alt="Preview Image 1" />
                    </div>
                    <span v-if="formRobustSubmitted && !watermark_image" class="text-red-500">Watermark Image is required</span>
                </div>
                <div class="flex flex-col">
                    <label for="extracted_watermark_image" class="mb-1">Extracted Watermark Image</label>
                    <input type="file" id="extracted_watermark_image" accept="image/*" ref="fileInput2" style="display: none" @change="handleImageChange(4, $event)" class="p-2 border rounded" />
                    <div class="flex items-center">
                        <label for="extracted_watermark_image" class="cursor-pointer bg-gray-200 p-2 rounded">Select Image 2</label>
                        <img v-if="imagePreviews[3]" :src="imagePreviews[3]" class="ml-4 h-20" alt="Preview Image 2" />
                    </div>
                    <span v-if="formRobustSubmitted && !extracted_watermark_image" class="text-red-500">Extracted Watermark Image is required</span>
                </div>
                <div class="flex justify-center">
                    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">{{ formSubtmitting ? "submitting" : "submit" }}</button>
                </div>
            </form>
            <!-- Robustness Analysis Response -->
            <div v-if="robustnessResponseData" class="mt-8">
                <h2 class="text-xl font-bold mb-2">Robustness Analysis Response</h2>
                <div class="bg-gray-100 p-4 rounded">
                    <div v-if="robustnessResponseData.data">
                        <p>BER: {{ robustnessResponseData.data.robustness_analysis.ber }}</p>
                        <p>NCC: {{ robustnessResponseData.data.robustness_analysis.ncc }}</p>
                    </div>
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

const config = useRuntimeConfig();

const formImperceptSubmitted = ref(false);
const formRobustSubmitted = ref(false);
const formSubtmitting = ref(false);

const host_image = ref<File | null>(null);
const watermarked_image = ref<File | null>(null);
const watermark_image = ref<File | null>(null);
const extracted_watermark_image = ref<File | null>(null);

const imagePreviews = ref<(string | null)[]>([null, null]);

var imperceptibilityResponseData = ref<ImperceptibilityApiResponse | null>(null);
var robustnessResponseData = ref<RobustnessApiResponse | null>(null);

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
                watermarked_image.value = file;
                imagePreviews.value[1] = result;
            } else if (index === 3) {
                watermark_image.value = file;
                imagePreviews.value[2] = result;
            } else if (index === 4) {
                extracted_watermark_image.value = file;
                imagePreviews.value[3] = result;
            }
        }
    };
    fileReader.readAsDataURL(file);
}

function validateImperceptibilityForm() {
    return {
        host_image: !!host_image.value,
        watermarked_image: !!watermarked_image.value,
    };
}

function validateRobustnessForm() {
    return {
        watermark_image: !!watermark_image.value,
        extracted_watermark_image: !!extracted_watermark_image.value,
    };
}

async function submitImperceptibilityForm() {
    formImperceptSubmitted.value = true;
    formSubtmitting.value = true;

    const validations = validateImperceptibilityForm();

    const isValid = Object.values(validations).every((field) => field);
    if (!isValid) {
        // Handle error messages or prevent form submission
        return;
    }

    const formData = new FormData();

    if (host_image.value) formData.append("host_image", host_image.value);
    if (watermarked_image.value) formData.append("watermarked_image", watermarked_image.value);

    try {
        imperceptibilityResponseData.value = await $fetch<ImperceptibilityApiResponse>(config.public.api_base + "/pymark/analysis?type=imperceptibility", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + filesharing.userJWTToken,
            },
            body: formData,
        });
        formSubtmitting.value = false;
    } catch (error) {
        console.error("Error:", error);
    }
}

async function submitRobustnessForm() {
    formRobustSubmitted.value = true;
    formSubtmitting.value = true;

    const validations = validateRobustnessForm();

    const isValid = Object.values(validations).every((field) => field);
    if (!isValid) {
        // Handle error messages or prevent form submission
        return;
    }

    const formData = new FormData();

    if (watermark_image.value) formData.append("watermark_image", watermark_image.value);
    if (extracted_watermark_image.value) formData.append("extracted_watermark_image", extracted_watermark_image.value);

    try {
        robustnessResponseData.value = await $fetch<RobustnessApiResponse>(config.public.api_base + "/pymark/analysis?type=robustness", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + filesharing.userJWTToken,
            },
            body: formData,
        });
        formSubtmitting.value = false;
    } catch (error) {
        console.error("Error:", error);
    }
}

interface ImperceptibilityApiResponse {
    data: {
        imperceptibility_analysis: {
            psnr: number;
            ssim: number;
        };
    };
    message: string;
    status: boolean;
}

interface RobustnessApiResponse {
    status: boolean;
    message: string;
    data: {
        robustness_analysis: {
            ber: number; // Bit Error Rate
            ncc: number; // Normalized Cross-Correlation
        };
    };
}
</script>

<style scope></style>
