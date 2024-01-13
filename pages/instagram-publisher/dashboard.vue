<template>
    <div>
        <div v-if="isLoading" class="flex justify-center items-center h-screen">
            <div class="flex flex-col justify-center w-1/3">
                <LoadingIndicator class="h-full" :options="defaultOptions" />
                <h1 class="text-center text-xs md:text-xl lg:2xl">Please wait....</h1>
            </div>
        </div>

        <div v-if="!isLoading" class="md:flex">
            <aside class="w-full md:w-1/3 p-4 flex flex-col">
                <header>
                    <div class="wrapper text-center">
                        <InstagramPublisherIntro class="mb-4 pt-4 pb-2 md:pt-8 md:pb-4" />
                        <button
                            @click="facebook.logout"
                            type="button"
                            class="text-white bg-gradient-to-br from-lime-600 to-emerald-700 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-lime-500 dark:focus:ring-lime-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                        >
                            Log out of Facebook
                        </button>
                    </div>
                </header>
            </aside>
            <main class="w-full md:w-2/3 p-4">
                <section v-if="facebook.userAccessToken" class="app-section mt-4 rounded-lg p-4">
                    <h3 class="text-2xl font-semibold mb-4">Send a post to Instagram</h3>
                    <!-- <AuthInput v-model="imageUrl" label="url" placeholder="Enter a JPEG iamge url" class="mb-4" /> -->
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

                    <TextAreaInput v-model="postCaption" class="mt-2 mb-4" aria-placeholder="Write a caption" id="caption" label="Post Caption" />
                    <FileSharingSubmit v-if="!formSubmitting" @click="shareInstagramPost">Share</FileSharingSubmit>
                    <div v-else class="relative w-full h-14 overflow-hidden flex items-center justify-center">
                        <LoadingIndicator class="h-32 absolute top-[-1.75rem]" :options="optionLoadingSubmit" />
                    </div>
                </section>
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import animationData from "~/assets/lotties/loading-animation.json";
import animationDataLoadingSubmit from "~/assets/lotties/loading-animation5.json";
import type { EmbeddingApiResponse } from "~/types/EmbeddingApiResponse";

const facebook = useFacebookStore();
const config = useRuntimeConfig();

const defaultOptions = ref({ animationData });
const optionLoadingSubmit = ref({ animationData: animationDataLoadingSubmit });
const postCaption = ref("");
const formSubmitting = ref(false);
const isLoading = ref(true);
const formSubmitted = ref(false);
const host_image = ref<File | null>(null);
const watermark_image = ref<File | null>(null);
const type = ref("gray");
const imageInputKey = ref(0);

const typeOptions = ["gray", "rgb"];

onNuxtReady(async () => {
    if (window.FB) {
        window.FB.getLoginStatus(async (response: any) => {
            console.log("masuk sini ya bre");
            if (response.status === "connected") {
                console.log("ya bre");
                facebook.setUserAccessToken(response.authResponse?.accessToken || "");
                facebook.me();
                isLoading.value = false;
            } else {
                await navigateTo("/instagram-publisher");
            }
        });
    }
});

function validateForm() {
    return {
        host_image: !!host_image.value,
        watermark_image: !!watermark_image.value,
        type: !!type.value,
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
            post_caption: postCaption.value,
        };

        const responseUpload = await $fetch(config.public.api_base + "/instagram/upload_post", {
            method: "POST",
            headers: {
                Authorization: "Facebook " + facebook.userAccessToken,
                "Content-Type": "application/json", // tambahkan header ini untuk menyatakan bahwa Anda mengirimkan JSON
            },
            body: JSON.stringify(postData), // ubah formData menjadi JSON.stringify(postData)
        });

        if (responseUpload.status) {
            // process is done
            alert("upload berhasil");

            // Increment the key to force a re-render of ImageInput components
            imageInputKey.value += 1;
        }
    } catch (error) {
        console.error("Error sharing post:", error);
    }

    formSubmitting.value = false;
};
</script>

<style>
/* Include your styles here */
</style>
