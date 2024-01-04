<template>
    <div>
        <div class="text-center px-3 xs:px-6 md:px-0">
            <InstagramPublisherIntro class="mb-8 pt-8 pb-5 md:pt-24 md:pb-3" />
            <div v-if="buttonReady" class="flex flex-wrap justify-center">
                <NavigationButton v-if="isLogin" to="/instagram-publisher/dashboard" label="Go to your dashboard" />
                <button
                    v-else
                    @click="loginFacebook"
                    type="button"
                    class="py-2 px-4 max-w-xs flex justify-center items-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                >
                    <svg width="20" height="20" fill="currentColor" class="mr-2" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1343 12v264h-157q-86 0-116 36t-30 108v189h293l-39 296h-254v759h-306v-759h-255v-296h255v-218q0-186 104-288.5t277-102.5q147 0 228 12z"></path>
                    </svg>
                    Sign in with Facebook
                </button>
            </div>
            <div class="mt-3">
                <span v-if="errorMessage" class="text-red-500">{{ errorMessage }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const facebook = useFacebookStore();
const errorMessage = ref<string>("");
const isLogin = ref<boolean>(false);
const buttonReady = ref(false);

function loginFacebook() {
    // Example usage:
    facebook
        .login()
        .then((accessToken) => {
            // Use accessToken for further operations
            console.log("Logged in successfully:");
            navigateTo("/instagram-publisher/dashboard");
        })
        .catch((error) => {
            // Handle login error
            console.error("Login failed:", error.message);
            errorMessage.value = error.message;
        });
}

onMounted(() => {
    if (window.FB) {
        window.FB.getLoginStatus((response: any) => {
            console.log(response);
            if (response.status === "connected") {
                isLogin.value = true;
            }
        });
    }
    buttonReady.value = true;
});
</script>

<style scoped>
/* Styling sesuai kebutuhan Anda */
</style>
