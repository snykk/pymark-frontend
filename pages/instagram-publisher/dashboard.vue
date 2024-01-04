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
                    <AuthInput v-model="imageUrl" label="url" placeholder="Enter a JPEG iamge url" class="mb-4" />
                    <TextAreaInput v-model="postCaption" class="mb-4" aria-placeholder="Write a caption" id="caption" label="Post Caption" />
                    <FileSharingSubmit @click="shareInstagramPost" :disabled="isSharingPost || !imageUrl"> {{ isSharingPost ? "Sharing..." : "Share" }}</FileSharingSubmit>
                </section>
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import animationData from "~/assets/lotties/loading-animation.json";

const defaultOptions = ref({ animationData });

import { getFacebookPages, getInstagramAccountId, createMediaObjectContainer, publishMediaObjectContainer } from "~/helpers/socialMediaLogic";

const facebook = useFacebookStore();

const imageUrl = ref("");
const postCaption = ref("");
const isSharingPost = ref(false);
const isLoading = ref(true);

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

const shareInstagramPost = async () => {
    isSharingPost.value = true;

    try {
        const facebookPages = await getFacebookPages(facebook.userAccessToken);

        if (facebookPages.length > 0) {
            const instagramAccountId = await getInstagramAccountId(facebookPages[0].id, facebook.userAccessToken);

            if (instagramAccountId) {
                const mediaObjectContainerId = await createMediaObjectContainer(instagramAccountId, facebook.userAccessToken, imageUrl.value, postCaption.value);

                if (mediaObjectContainerId) {
                    await publishMediaObjectContainer(instagramAccountId, facebook.userAccessToken, mediaObjectContainerId);

                    imageUrl.value = "";
                    postCaption.value = "";
                } else {
                    console.error("Media object container ID is undefined");
                }
            } else {
                console.error("Instagram account ID is undefined");
            }
        } else {
            console.error("No Facebook pages found");
        }
    } catch (error) {
        console.error("Error sharing post:", error);
    }

    isSharingPost.value = false;
};
</script>

<style>
/* Include your styles here */
</style>
