<template>
    <div>
        <main id="app-main" class="p-4">
            <section class="app-section bg-gray-100 rounded-lg p-4">
                <h3 class="text-lg font-semibold mb-4">1. Log in with Facebook</h3>
                <button v-if="!facebook.userAccessToken" @click="facebook.login" class="btn action-btn bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Login with Facebook</button>
                <button v-else @click="facebook.logout" class="btn action-btn bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">Log out of Facebook</button>
            </section>
            <section v-if="facebook.userAccessToken" class="app-section mt-4 bg-gray-100 rounded-lg p-4">
                <h3 class="text-lg font-semibold mb-4">2. Send a post to Instagram</h3>
                <input v-model="imageUrl" placeholder="Enter a JPEG image url..." class="border rounded-lg py-2 px-4 mb-4 w-full" />
                <textarea v-model="postCaption" placeholder="Write a caption..." rows="5" class="border rounded-lg py-2 px-4 w-full mb-4"></textarea>
                <button @click="shareInstagramPost" :disabled="isSharingPost || !imageUrl" class="btn action-btn bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                    {{ isSharingPost ? "Sharing..." : "Share" }}
                </button>
            </section>
        </main>
        <!-- Include other components or sections as needed -->
    </div>
</template>

<script setup lang="ts">
import { getFacebookPages, getInstagramAccountId, createMediaObjectContainer, publishMediaObjectContainer } from "~/helpers/socialMediaLogic";

const facebook = useFacebookStore();

const imageUrl = ref("");
const postCaption = ref("");
const isSharingPost = ref(false);

onMounted(() => {
    if (window.FB) {
        window.FB.getLoginStatus((response: any) => {
            facebook.setUserAccessToken(response.authResponse?.accessToken || "");
        });
    }
});

const shareInstagramPost = async () => {
    isSharingPost.value = true;

    try {
        const facebookPages = await getFacebookPages(facebook.userAccessToken);
        console.log("facebook pages nih bos", facebookPages);

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
