<template>
    <section v-if="facebook.userAccessToken" class="app-section mt-4 rounded-lg p-4">
        <h3 class="text-2xl font-semibold mb-4">Send a post to Instagram</h3>
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

        <TextAreaInput v-model="post_caption" class="mt-2 mb-4" aria-placeholder="Write a caption" id="caption" label="Post Caption" />
        <FileSharingSubmit v-if="!formSubmitting" @click="shareInstagramPost">Share</FileSharingSubmit>
        <div v-else class="relative w-full h-14 overflow-hidden flex items-center justify-center">
            <LoadingIndicator class="h-32 absolute top-[-1.75rem]" :options="optionLoadingSubmit" />
        </div>
    </section>
</template>

<script setup lang="ts">
import animationDataLoadingSubmit from "~/assets/lotties/loading-animation5.json";
import type EmbeddingApiResponse from "~/types/EmbeddingApiResponse";
import { useToast } from "vue-toastification";
import type BaseApiResponse from "~/types/BaseApiResponse";

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
    formData.append("alpha", "0.1");
    formData.append("embed_folder", "pymark-instagram-post");

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

        // process is done
        type.value = "gray";
        post_caption.value = "";

        // Increment the key to force a re-render of ImageInput components
        imageInputKey.value += 1;
        useToast().success(responseUpload.message);
    } catch (error: any) {
        useToast().error(error.response._data.message);
    }

    formSubmitting.value = false;
};
</script>

<style scope></style>
