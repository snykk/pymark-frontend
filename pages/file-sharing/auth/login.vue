<template>
    <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white text-center">Sign in to PyMark</h2>
        <Flasher v-if="flasher.flashMessage" :message="flasher.flashMessage" :label="flasher.flashLabel" />
        <form class="mt-8 space-y-6" @submit.prevent="submitForm">
            <div>
                <AuthInput v-model="user.email" placeholder="name@company.com" label="email" />
                <span v-if="formSubmitted && !user.email" class="text-red-500">Email is required</span>
            </div>
            <div>
                <AuthInput v-model="user.password" placeholder="************" label="password" />
                <span v-if="formSubmitted && !user.password" class="text-red-500">Password is required</span>
            </div>
            <button
                v-if="flasher.flashMessage.includes('email verification')"
                @click="navigateTo('/file-sharing/auth/verif-otp?email=' + user.email)"
                class="px-3 py-2 text-xs font-medium text-center inline-flex items-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
                <svg class="w-3 h-3 text-white me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                    <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                    <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                </svg>
                Email Verification
            </button>
            <AuthSubmit class="w-56">Login to your account</AuthSubmit>
            <div class="text-sm font-medium text-gray-900 dark:text-white">
                Not registered yet?
                <NuxtLink to="/file-sharing/auth/regis" class="text-blue-600 hover:underline dark:text-blue-500">Create account</NuxtLink>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import type LoginFileSharingResponse from "~/types/LoginFileSharingResponse";

const filesharing = useFileSharingStore();
const flasher = useFlashStore();
const route = useRoute();

const user = ref({
    email: "",
    password: "",
});
const formSubmitted = ref(false);

definePageMeta({
    layout: "auth-filesharing",
    middleware: [
        function (to, from) {
            const { userJWTToken } = storeToRefs(useFileSharingStore());
            const jwtTOken = useCookie("userJWTToken");
            if (jwtTOken.value) {
                userJWTToken.value = jwtTOken.value;
                return navigateTo("/file-sharing/embedding");
            }
        },
    ],
});

onUnmounted(() => {
    flasher.clearFlashMessage();
});

const submitForm = async () => {
    formSubmitted.value = true;
    // errorMessage.value = "";
    flasher.clearFlashMessage();

    if (!user.value.email || !user.value.password) {
        return;
    }

    filesharing
        .login(user.value)
        .then((response: LoginFileSharingResponse) => {
            if (response.status === true) {
                // Successful login (HTTP 200)
                filesharing.setUserJWTToken(response.data!.access_token!, response.data!.user!.username, response.data!.user!.email);

                const redirectFrom = route.query.redirectFrom as string;
                if (redirectFrom) {
                    navigateTo(redirectFrom);
                    return;
                }

                navigateTo("/file-sharing/embedding");
                return;
            }

            flasher.setFlashMessage(response.message, FlashLabel.DANGER);
            // errorMessage.value = response.message || "Failed to login";
        })
        .catch((error) => {
            flasher.setFlashMessage(error.response._data.message, FlashLabel.DANGER);
            // errorMessage.value = error.response._data.message || "Something went wrong";
        });
};
</script>

<style>
/* Add any custom styles or overrides here */
</style>
