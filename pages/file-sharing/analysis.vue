<template>
    <main>
        <nav class="flex mb-4">
            <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li
                    :class="{ 'font-extrabold': selectedForm === 'imperceptibility' }"
                    @click="selectedForm = 'imperceptibility'"
                    class="inline-flex items-center text-sm text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white cursor-pointer"
                >
                    Imperceptibility
                </li>
                <span class="mx-2 text-gray-400 text-xl">/</span>
                <li :class="{ 'font-extrabold': selectedForm === 'robustness' }" @click="selectedForm = 'robustness'" class="text-sm text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white cursor-pointer">Robustness</li>
            </ol>
        </nav>
        <div v-if="selectedForm === 'imperceptibility'">
            <h1 class="text-2xl font-bold mb-4">Imperceptibility Analysis</h1>
            <form @submit.prevent="submitImperceptibilityForm" class="space-y-4" enctype="multipart/form-data">
                <div class="flex flex-col md:flex-row items-end">
                    <ImageInput class="md:me-1 w-full" v-model="host_image" id="host_image" label="Host Image" :formSubmitted="formImperceptSubmitted" />
                    <ImageInput class="md:ms-1 w-full" v-model="watermarked_image" id="watermarked_image" label="Watermarked Image" :formSubmitted="formImperceptSubmitted" />
                </div>
                <div class="flex flex-col md:flex-row" style="margin: 0">
                    <div class="md:me-1 w-full">
                        <span v-if="formImperceptSubmitted && !host_image" class="text-red-500">Host Image is required</span>
                    </div>
                    <div class="md:ms-1 w-full">
                        <span v-if="formImperceptSubmitted && !watermarked_image" class="text-red-500">Watermarked Image is required</span>
                    </div>
                </div>
                <FileSharingSubmit class="flex justify-center mt-10">{{ formImperceptSubtmitting ? "submitting" : "submit" }}</FileSharingSubmit>
            </form>
            <!-- Imperceptibility Analysis Response -->
            <div v-if="imperceptibilityResponseData" class="mt-8 mb-5">
                <h2 class="text-xl font-bold mb-2">Imperceptibility Analysis Response</h2>
                <div v-if="imperceptibilityResponseData.data">
                    <p>PSNR: {{ imperceptibilityResponseData.data.imperceptibility_analysis.psnr }}</p>
                    <p>SSIM: {{ imperceptibilityResponseData.data.imperceptibility_analysis.ssim }}</p>
                </div>
            </div>
        </div>

        <div v-else-if="selectedForm === 'robustness'">
            <h1 class="text-2xl font-bold mb-4">Robustness Analysis</h1>
            <form @submit.prevent="submitRobustnessForm" class="space-y-4" enctype="multipart/form-data">
                <div class="flex flex-col md:flex-row items-end">
                    <ImageInput class="md:me-1 w-full" v-model="watermark_image" id="watermark_image" label="Watermark Image" :formSubmitted="formRobustSubmitted" />
                    <ImageInput class="md:ms-1 w-full" v-model="extracted_watermark_image" id="extracted_watermark_image" label="Watermarked Image" :formSubmitted="formRobustSubmitted" />
                </div>
                <div class="flex flex-col md:flex-row" style="margin: 0">
                    <span v-if="formRobustSubmitted && !watermark_image" class="text-red-500 md:me-1 w-full">Watermark image is required</span>
                    <span v-if="formRobustSubmitted && !extracted_watermark_image" class="text-red-500 md:ms-1 w-full">Extracted watermark image is required</span>
                </div>
                <FileSharingSubmit class="flex justify-center">{{ formRobustnesSubtmitting ? "submitting" : "submit" }}</FileSharingSubmit>
            </form>
            <!-- Robustness Analysis Response -->
            <div v-if="robustnessResponseData" class="mt-8">
                <h2 class="text-xl font-bold mb-2">Robustness Analysis Response</h2>
                <div v-if="robustnessResponseData.data">
                    <p>BER: {{ robustnessResponseData.data.robustness_analysis.ber }}</p>
                    <p>NCC: {{ robustnessResponseData.data.robustness_analysis.ncc }}</p>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
definePageMeta({
    layout: "filesharing",
    middleware: ["auth-filesharing"],
});

const selectedForm = ref<"imperceptibility" | "robustness">("imperceptibility");

const filesharing = useFileSharingStore();

const config = useRuntimeConfig();

const formImperceptSubmitted = ref(false);
const formRobustSubmitted = ref(false);

const formImperceptSubtmitting = ref(false);
const formRobustnesSubtmitting = ref(false);

const host_image = ref<File | null>(null);
const watermarked_image = ref<File | null>(null);
const watermark_image = ref<File | null>(null);
const extracted_watermark_image = ref<File | null>(null);

var imperceptibilityResponseData = ref<ImperceptibilityApiResponse | null>(null);
var robustnessResponseData = ref<RobustnessApiResponse | null>(null);

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
    formImperceptSubtmitting.value = true;

    const validations = validateImperceptibilityForm();

    const isValid = Object.values(validations).every((field) => field);
    if (!isValid) {
        // Handle error messages or prevent form submission
        formImperceptSubtmitting.value = false;
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
    } catch (error) {
        console.error("Error:", error);
    }

    formImperceptSubtmitting.value = false;
}

async function submitRobustnessForm() {
    formRobustSubmitted.value = true;
    formRobustnesSubtmitting.value = true;

    const validations = validateRobustnessForm();

    const isValid = Object.values(validations).every((field) => field);
    if (!isValid) {
        formRobustnesSubtmitting.value = false;
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
    } catch (error) {
        console.error("Error:", error);
    }

    formRobustnesSubtmitting.value = false;
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
