<template>
    <div>
        <main id="app-main" class="p-4">
            <section v-if="facebook.userAccessToken" class="app-section mt-4 rounded-lg p-4">
                <h3 class="text-2xl font-semibold mb-4">Send a post to Instagram</h3>
                <AuthInput v-model="imageUrl" label="url" placeholder="Enter a JPEG iamge url" class="mb-4" />
                <TextAreaInput v-model="postCaption" class="mb-4" aria-placeholder="Write a caption" id="caption" label="Post Caption" />
                <FileSharingSubmit @click="shareInstagramPost" :disabled="isSharingPost || !imageUrl"> {{ isSharingPost ? "Sharing..." : "Share" }}</FileSharingSubmit>
            </section>
        </main>
    </div>
</template>

<script setup lang="ts">
import { getFacebookPages, getInstagramAccountId, createMediaObjectContainer, publishMediaObjectContainer } from "~/helpers/socialMediaLogic";

const facebook = useFacebookStore();

const imageUrl = ref("");
const postCaption = ref("");
const isSharingPost = ref(false);

definePageMeta({
    layout: "instagram",
});

onMounted(() => {
    if (window.FB) {
        window.FB.getLoginStatus((response: any) => {
            facebook.setUserAccessToken(response.authResponse?.accessToken || "");
            facebook.me();
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
