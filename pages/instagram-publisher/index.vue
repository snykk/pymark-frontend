<template>
    <div>
        <main id="app-main" class="p-4">
            <section class="app-section bg-gray-100 rounded-lg p-4">
                <h3 class="text-lg font-semibold mb-4">1. Log in with Facebook</h3>
                <button v-if="!facebookUserAccessToken" @click="logInToFB" class="btn action-btn bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Login with Facebook</button>
                <button v-else @click="logOutOfFB" class="btn action-btn bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">Log out of Facebook</button>
            </section>
            <section v-if="facebookUserAccessToken" class="app-section mt-4 bg-gray-100 rounded-lg p-4">
                <h3 class="text-lg font-semibold mb-4">2. Send a post to Instagram</h3>
                <p class="mb-2">This is your token {{ facebookUserAccessToken }}</p>
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
import { ref, onMounted } from "vue";

const imageUrl = ref("");
const postCaption = ref("");
const isSharingPost = ref(false);
const facebookUserAccessToken = ref<string | null>(null);

onMounted(() => {
    const checkLoginStatus = () => {
        if (window.FB) {
            window.FB.getLoginStatus((response: any) => {
                console.log(response);
                facebookUserAccessToken.value = response.authResponse?.accessToken || "";
            });
        }
    };

    checkLoginStatus();
});

const logInToFB = () => {
    if (window.FB) {
        window.FB.login(
            function (response: fb.StatusResponse) {
                facebookUserAccessToken.value = response.authResponse?.accessToken || null;
                if (response.authResponse) {
                    console.log("Welcome! Fetching your information.... ");
                    FB.api("/me", function (apiResponse: { name: string }) {
                        console.log("Good to see you, " + apiResponse.name + ".");
                    });
                } else {
                    console.log("User cancelled login or did not fully authorize.");
                }
            },
            {
                scope: "instagram_basic,pages_show_list",
            }
        );
    }
};

const logOutOfFB = () => {
    if (window.FB) {
        window.FB.logout(() => {
            facebookUserAccessToken.value = "";
        });
    }
};

const getFacebookPages = async () => {
    try {
        const response = await new Promise((resolve, reject) => {
            console.log("token yang dipake:", facebookUserAccessToken.value);
            window.FB.api("me/accounts", { access_token: facebookUserAccessToken.value }, (response) => {
                console.log("response pages", response);
                if (!response || response.error) {
                    console.error("Error fetching Facebook pages:", response.error);
                    reject(response.error);
                } else {
                    console.log("Facebook pages:", response.data);
                    resolve(response.data);
                }
            });
        });
        return response || [];
    } catch (error) {
        console.error("Error fetching Facebook pages:", error);
        return [];
    }
};

const getInstagramAccountId = async (facebookPageId: string) => {
    try {
        const response = await new Promise((resolve) => {
            window.FB.api(
                facebookPageId,
                {
                    access_token: facebookUserAccessToken.value,
                    fields: "instagram_business_account",
                },
                (response) => {
                    console.log("response instagram account:", response);
                    const instagramAccountId = response?.instagram_business_account?.id;
                    if (instagramAccountId) {
                        resolve(instagramAccountId);
                    } else {
                        console.error("Instagram account ID not found");
                        resolve(null);
                    }
                }
            );
        });
        return response;
    } catch (error) {
        console.error("Error fetching Instagram account ID:", error);
        return null;
    }
};

const createMediaObjectContainer = async (instagramAccountId: string) => {
    console.log("instagram account id:", instagramAccountId);
    try {
        console.log("image url", imageUrl.value);
        console.log("caption", postCaption.value);
        const response = await new Promise((resolve) => {
            window.FB.api(
                `${instagramAccountId}/media`,
                "post",
                {
                    access_token: facebookUserAccessToken.value,
                    image_url: imageUrl.value,
                    caption: postCaption.value,
                },
                (response) => {
                    console.log("respponse media obj", response);
                    resolve(response.id);
                }
            );
        });
        return response;
    } catch (error) {
        console.error("Error creating media object container:", error);
        return null;
    }
};

const publishMediaObjectContainer = async (instagramAccountId: string, mediaObjectContainerId: string) => {
    try {
        const response = await new Promise((resolve) => {
            window.FB.api(
                `${instagramAccountId}/media_publish`,
                "POST",
                {
                    access_token: facebookUserAccessToken.value,
                    creation_id: mediaObjectContainerId,
                },
                (response) => {
                    resolve(response.id);
                }
            );
        });
        return response;
    } catch (error) {
        console.error("Error publishing media object container:", error);
        return null;
    }
};

const shareInstagramPost = async () => {
    isSharingPost.value = true;

    try {
        const facebookPages = await getFacebookPages();
        console.log("facebook pages nih bos", facebookPages);

        if (facebookPages.length > 0) {
            const instagramAccountId = await getInstagramAccountId(facebookPages[0].id);

            if (instagramAccountId) {
                const mediaObjectContainerId = await createMediaObjectContainer(instagramAccountId);

                if (mediaObjectContainerId) {
                    await publishMediaObjectContainer(instagramAccountId, mediaObjectContainerId);

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
