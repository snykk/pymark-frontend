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
            <h1 class="text-2xl font-bold mb-4">
                Imperceptibility Analysis
                <UserGuideButton @click="showImperceptibilityUserGuideModal" />
            </h1>
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
                <div class="flex flex-col">
                    <DropdownInput v-model="type" label="type" :options="typeOptions" />
                </div>
                <FileSharingSubmit :disabled="formImperceptSubtmitting" class="flex justify-center mt-10">{{ formImperceptSubtmitting ? "submitting" : "submit" }}</FileSharingSubmit>
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

        <!-- PyMark Imperceptibility Analysis User Guide Modal -->
        <div v-if="showImperceptibilityUserGuide" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                <button @click="hideImperceptibilityUserGuideModal" class="absolute top-3 right-3 text-gray-500 dark:text-gray-400 focus:outline-none">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>

                <div class="relative bg-gray-50 dark:bg-gray-800 w-full max-w-[80vw] p-6 rounded-lg shadow-lg overflow-y-auto max-h-[80vh] text-justify text-align-last-justify">
                    <h2 class="text-xl font-bold mb-4">PyMark Imperceptibility Analysis User Guide</h2>
                    <p class="mb-4">
                        Imperceptibility Analysis aims to evaluate how well a watermark embedded into a host image can be concealed, making it imperceptible to the human eye. This analysis involves calculating the values of PSNR (Peak
                        Signal-to-Noise Ratio) and SSIM (Structural Similarity Index) between the host image and the watermarked image. Higher PSNR and SSIM values indicate better imperceptibility of the embedded watermark.
                    </p>
                    <p class="mb-4">Here's a guide on how to use the PyMark Imperceptibility Analysis feature:</p>
                    <ol class="list-decimal list-inside mb-4">
                        <li class="mb-1">Upload the host image and watermarked image.</li>
                        <li class="mb-1">Choose the type of analysis (gray or RGB).</li>
                        <li class="mb-1">Click the submit button to run the analysis.</li>
                    </ol>
                    <p class="">After submission, you will see the embedding result, imperceptibility analysis, watermarked image preview, and other related links.</p>
                </div>
            </div>
        </div>

        <div v-else-if="selectedForm === 'robustness'">
            <h1 class="text-2xl font-bold mb-4">
                Robustness Analysis
                <UserGuideButton @click="showRobustnessUserGuideModal" />
            </h1>
            <form @submit.prevent="submitRobustnessForm" class="space-y-4" enctype="multipart/form-data">
                <div class="flex flex-col md:flex-row items-end">
                    <ImageInput class="md:me-1 w-full" v-model="watermark_image" id="watermark_image" label="Watermark Image" :formSubmitted="formRobustSubmitted" />
                    <ImageInput class="md:ms-1 w-full" v-model="extracted_watermark_image" id="extracted_watermark_image" label="Extracted Image" :formSubmitted="formRobustSubmitted" />
                </div>
                <div class="flex flex-col md:flex-row" style="margin: 0">
                    <span v-if="formRobustSubmitted && !watermark_image" class="text-red-500 md:me-1 w-full">Watermark image is required</span>
                    <span v-if="formRobustSubmitted && !extracted_watermark_image" class="text-red-500 md:ms-1 w-full">Extracted watermark image is required</span>
                </div>
                <div class="flex flex-col">
                    <DropdownInput v-model="type" label="type" :options="typeOptions" />
                </div>
                <FileSharingSubmit :disabled="formRobustnesSubtmitting" class="flex justify-center">{{ formRobustnesSubtmitting ? "submitting" : "submit" }}</FileSharingSubmit>
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

        <!-- PyMark Imperceptibility Analysis User Guide Modal -->
        <div v-if="showRobustnessUserGuide" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                <button @click="hideRobustnessUserGuideModal" class="absolute top-3 right-3 text-gray-500 dark:text-gray-400 focus:outline-none">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>

                <div class="relative bg-gray-50 dark:bg-gray-800 w-full max-w-[80vw] p-6 rounded-lg shadow-lg overflow-y-auto max-h-[80vh] text-justify text-align-last-justify">
                    <h2 class="text-xl font-bold mb-4">PyMark Robustness Analysis User Guide</h2>
                    <p class="mb-4">
                        Robustness Analysis is used to assess the resilience of a watermark against specific attacks or transformations that may affect the ability to extract the watermark. Some common metrics used in robustness analysis
                        include Bit Error Rate (BER) and Normalized Cross-Correlation (NCC). Low BER values and high NCC values indicate that the watermark can be reliably recovered even after undergoing certain attacks or transformations.
                    </p>
                    <p class="mb-4">Here's a guide on how to use the PyMark Robustness Analysis feature:</p>
                    <ol class="list-decimal list-inside mb-4">
                        <li class="mb-1">Upload the watermark image and extracted watermark image.</li>
                        <li class="mb-1">Choose the type of analysis (gray or RGB).</li>
                        <li class="mb-1">Click the submit button to run the analysis.</li>
                    </ol>
                    <p class="">After submission, you will see the embedding result, imperceptibility analysis, watermarked image preview, and other related links.</p>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { useToast } from "vue-toastification";

definePageMeta({
    layout: "filesharing",
    middleware: ["auth-filesharing"],
});

const filesharing = useFileSharingStore();
const config = useRuntimeConfig();

const selectedForm = ref<"imperceptibility" | "robustness">("imperceptibility");
const formImperceptSubmitted = ref(false);
const formRobustSubmitted = ref(false);
const formImperceptSubtmitting = ref(false);
const formRobustnesSubtmitting = ref(false);
const host_image = ref<File | null>(null);
const watermarked_image = ref<File | null>(null);
const watermark_image = ref<File | null>(null);
const extracted_watermark_image = ref<File | null>(null);
const type = ref("gray");
const imperceptibilityResponseData = ref<ImperceptibilityApiResponse | null>(null);
const robustnessResponseData = ref<RobustnessApiResponse | null>(null);
const requestLoadingElement = ref<HTMLElement | null>(null);
const showImperceptibilityUserGuide = ref(false);
const showRobustnessUserGuide = ref(false);

const typeOptions = ["gray", "rgb"];

onMounted(() => {
    const element = document.getElementById("loading_submit_request");

    if (element) {
        requestLoadingElement.value = element as HTMLElement;
    }
});

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
    const h1Element = requestLoadingElement.value?.querySelector("h1");

    if (h1Element) {
        // Check if the h1 element exists
        h1Element.textContent = "Imperceptibility analysis is running";
    }

    requestLoadingElement.value?.classList.remove("hidden");
    formImperceptSubmitted.value = true;
    formImperceptSubtmitting.value = true;
    imperceptibilityResponseData.value = null;

    const validations = validateImperceptibilityForm();

    const isValid = Object.values(validations).every((field) => field);
    if (!isValid) {
        formImperceptSubtmitting.value = false;
        requestLoadingElement.value?.classList.add("hidden");
        return;
    }

    // Scroll to the loading element
    if (requestLoadingElement.value) {
        requestLoadingElement.value.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    const formData = new FormData();

    if (host_image.value) formData.append("host_image", host_image.value);
    if (watermarked_image.value) formData.append("watermarked_image", watermarked_image.value);
    formData.append("image_type", type.value);

    try {
        imperceptibilityResponseData.value = await $fetch<ImperceptibilityApiResponse>(config.public.api_base + "/pymark/analysis?type=imperceptibility", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + filesharing.userJWTToken,
            },
            body: formData,
        });

        useToast().success(imperceptibilityResponseData.value.message);
    } catch (error: any) {
        useToast().error(error.response._data.message);
    }

    formImperceptSubtmitting.value = false;
    requestLoadingElement.value?.classList.add("hidden");
}

async function submitRobustnessForm() {
    const h1Element = requestLoadingElement.value?.querySelector("h1");

    if (h1Element) {
        // Check if the h1 element exists
        h1Element.textContent = "Robustness analysis is running";
    }

    requestLoadingElement.value?.classList.remove("hidden");
    robustnessResponseData.value = null;
    formRobustSubmitted.value = true;
    formRobustnesSubtmitting.value = true;

    const validations = validateRobustnessForm();

    const isValid = Object.values(validations).every((field) => field);
    if (!isValid) {
        formRobustnesSubtmitting.value = false;
        requestLoadingElement.value?.classList.add("hidden");
        return;
    }

    // Scroll to the loading element
    if (requestLoadingElement.value) {
        requestLoadingElement.value.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    const formData = new FormData();

    if (watermark_image.value) formData.append("watermark_image", watermark_image.value);
    if (extracted_watermark_image.value) formData.append("extracted_watermark_image", extracted_watermark_image.value);
    formData.append("image_type", type.value);

    try {
        robustnessResponseData.value = await $fetch<RobustnessApiResponse>(config.public.api_base + "/pymark/analysis?type=robustness", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + filesharing.userJWTToken,
            },
            body: formData,
        });

        useToast().success(robustnessResponseData.value.message);
    } catch (error: any) {
        useToast().error(error.response._data.message);
    }

    formRobustnesSubtmitting.value = false;
    requestLoadingElement.value?.classList.add("hidden");
}

function showImperceptibilityUserGuideModal() {
    showImperceptibilityUserGuide.value = true;
}

function showRobustnessUserGuideModal() {
    showRobustnessUserGuide.value = true;
}

function hideImperceptibilityUserGuideModal() {
    showImperceptibilityUserGuide.value = false;
}

function hideRobustnessUserGuideModal() {
    showRobustnessUserGuide.value = false;
}
</script>

<style scope></style>
