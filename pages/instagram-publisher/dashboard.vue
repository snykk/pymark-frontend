<template>
    <section v-if="facebook.userAccessToken" class="app-section rounded-lg px-4 relative space-y-6">
        <h3 class="text-2xl font-semibold mb-4">
            Send a post to Instagram
            <UserGuideButton @click="showUserGuideModal" />
        </h3>
        <div class="flex flex-col md:flex-row items-end">
            <ImageInput :key="imageInputKey" class="md:me-2 w-full md:w-1/2" v-model="host_image" id="host_image" label="Host Image" :formSubmitted="formSubmitted" />
            <ImageInput :key="imageInputKey" class="md:ms-2 w-full md:w-1/2" v-model="watermark_image" id="" label="Watermark Image" :formSubmitted="formSubmitted" />
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

        <TextAreaInput v-model="post_caption" aria-placeholder="Write a caption" id="caption" label="Post Caption" />
        <FileSharingSubmit v-if="!formSubmitting" @click="shareInstagramPost">Share</FileSharingSubmit>
        <div v-else class="relative w-full h-14 overflow-hidden flex items-center justify-center">
            <LoadingIndicator class="h-32 absolute top-[-1.75rem]" :options="optionLoadingSubmit" />
        </div>

        <!-- PyMark Post Now User Guide Modal -->
        <div v-if="showUserGuide" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                <button @click="hideUserGuideModal" class="absolute top-3 right-3 text-gray-500 dark:text-gray-400 focus:outline-none">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>

                <div class="relative bg-gray-50 dark:bg-gray-800 w-full max-w-[80vw] p-6 rounded-lg shadow-lg overflow-y-auto max-h-[80vh] text-justify text-align-last-justify">
                    <h2 class="text-xl font-bold mb-4">My Post User Guide</h2>
                    <p class="mb-4">The My Post feature allows you to automatically send watermarked images to your Instagram account using your Facebook credentials. Follow the steps below to create and share a post on Instagram:</p>
                    <ol class="list-decimal list-inside mb-4">
                        <li class="mb-1">Upload the host image and the watermark image by clicking on the respective image input fields.</li>
                        <li class="mb-1">Choose the type of images from the dropdown menu.</li>
                        <li class="mb-1">Write a caption for your post in the provided textarea.</li>
                        <li class="mb-1">Click the "Share" button to automatically send the watermarked image to your Instagram account.</li>
                    </ol>
                    <p class="">Once shared, your post will be visible on your Instagram profile with the caption you provided.</p>
                </div>
            </div>
        </div>

        <!-- back to top button -->
        <BackToTopButton />
        <!-- reset button -->
        <ResetButton v-if="isFormDirty && !formSubmitting" @click="resetForm" />
    </section>
</template>

<script setup lang="ts">
import animationDataLoadingSubmit from "~/assets/lotties/loading-animation5.json";
import { useToast } from "vue-toastification";

definePageMeta({
    layout: "instagram",
});

const facebook = useFacebookStore();
const config = useRuntimeConfig();

const optionLoadingSubmit = ref({ animationData: animationDataLoadingSubmit });
const post_caption = ref("");
const formSubmitting = ref(false);
const formSubmitted = ref(false);
const host_image = ref<File | null>(null);
const watermark_image = ref<File | null>(null);
const type = ref("gray");
const imageInputKey = ref(0);

const typeOptions = ["gray", "rgb"];

function validateForm() {
    return {
        host_image: !!host_image.value,
        watermark_image: !!watermark_image.value,
        type: !!type.value,
        post_caption: !!post_caption.value,
    };
}

const shareInstagramPost = async () => {
    formSubmitting.value = true;
    formSubmitted.value = true;

    const validations = validateForm();

    const isValid = Object.values(validations).every((field) => field);
    if (!isValid) {
        console.log("required field");
        formSubmitting.value = false;
        return;
    }

    const formData = new FormData();

    if (host_image.value) formData.append("host_image", host_image.value);
    if (watermark_image.value) formData.append("watermark_image", watermark_image.value);
    formData.append("alpha", "0.06");
    formData.append("embed_folder", "pymark-instagram-post");
    formData.append("post_caption", post_caption.value);

    try {
        // embedding scenario
        const responseEmbedding = await $fetch<EmbeddingApiResponse>(config.public.api_base + "/pymark/embed_" + type.value, {
            method: "POST",
            headers: {
                Authorization: "Facebook " + facebook.userAccessToken,
            },
            body: formData,
        });

        // upload post scenario
        const postData = {
            image_url: responseEmbedding.data.uploaded_file_responses.public_compressed_image.download_link,
            post_caption: post_caption.value,
        };

        const responseUpload: BaseApiResponse<null> = await $fetch(config.public.api_base + "/instagram/upload_post", {
            method: "POST",
            headers: {
                Authorization: "Facebook " + facebook.userAccessToken,
                "Content-Type": "application/json", // tambahkan header ini untuk menyatakan bahwa Anda mengirimkan JSON
            },
            body: JSON.stringify(postData), // ubah formData menjadi JSON.stringify(postData)
        });

        if (!responseUpload.status) {
            useToast().error(responseUpload.message);
        }

        resetForm();

        useToast().success(responseUpload.message);
    } catch (error: any) {
        useToast().error(error.response._data.message);
    }

    formSubmitting.value = false;
};

const isFormDirty = computed(() => {
    return host_image.value !== null || watermark_image.value !== null || type.value !== "gray" || post_caption.value !== "";
});

const resetForm = () => {
    host_image.value = null;
    watermark_image.value = null;
    type.value = "gray";

    post_caption.value = "";

    imageInputKey.value += 1;
    formSubmitted.value = false;
};

const showUserGuide = ref(false);

function showUserGuideModal() {
    showUserGuide.value = true;
}

function hideUserGuideModal() {
    showUserGuide.value = false;
}
</script>

<style scope></style>
