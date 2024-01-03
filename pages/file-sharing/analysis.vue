<template>
    <div class="p-4">
        <div>
            <h1 class="text-2xl font-bold mb-4">Form Imperceptibility Analysis</h1>
            <form @submit.prevent="submitImperceptibilityForm" class="space-y-4" enctype="multipart/form-data">
                <div class="flex flex-col md:flex-row">
                    <ImageInput class="md:me-1 w-full" v-model="host_image" id="host_image" label="Host Image" :formSubmitted="formImperceptSubmitted" />
                    <ImageInput class="md:ms-1 w-full" v-model="watermarked_image" id="watermarked_image" label="Watermarked Image" :formSubmitted="formImperceptSubmitted" />
                </div>
                <div class="flex flex-col md:flex-row" style="margin: 0">
                    <span v-if="formImperceptSubmitted && !host_image" class="text-red-500 md:me-1 w-full">Host Image is required</span>
                    <span v-if="formImperceptSubmitted && !watermarked_image" class="text-red-500 md:ms-1 w-full">Watermarked Image is required</span>
                </div>
                <div class="flex justify-center mt-20">
                    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">{{ formImperceptSubtmitting ? "submitting" : "submit" }}</button>
                </div>
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

        <div>
            <h1 class="text-2xl font-bold mb-4">Form Robustness Analysis</h1>
            <form @submit.prevent="submitRobustnessForm" class="space-y-4" enctype="multipart/form-data">
                <div class="flex flex-col md:flex-row">
                    <ImageInput class="md:me-1 w-full" v-model="watermark_image" id="watermark_image" label="Watermark Image" :formSubmitted="formRobustSubmitted" />
                    <ImageInput class="md:ms-1 w-full" v-model="extracted_watermark_image" id="extracted_watermark_image" label="Watermarked Image" :formSubmitted="formRobustSubmitted" />
                </div>
                <div class="flex flex-col md:flex-row" style="margin: 0">
                    <span v-if="formRobustSubmitted && !watermark_image" class="text-red-500 md:me-1 w-full">Watermark image is required</span>
                    <span v-if="formRobustSubmitted && !extracted_watermark_image" class="text-red-500 md:ms-1 w-full">Extracted watermark image is required</span>
                </div>
                <div class="flex justify-center mt-20">
                    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">{{ formRobustnesSubtmitting ? "submitting" : "submit" }}</button>
                </div>
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

const formImperceptSubtmitting = ref(false);
const formRobustnesSubtmitting = ref(false);

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
