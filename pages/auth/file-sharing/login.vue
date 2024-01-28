<template>
    <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white text-center">Sign in to PyMark</h2>
        <form class="mt-8 space-y-6" @submit.prevent="submitForm">
            <div>
                <AuthInput v-model="user.email" placeholder="name@company.com" label="email" />
                <span v-if="formSubmitted && !user.email" class="text-red-500">Email is required</span>
            </div>
            <div>
                <AuthInput v-model="user.password" placeholder="************" label="password" />
                <span v-if="formSubmitted && !user.password" class="text-red-500">Password is required</span>
            </div>
            <div v-if="formSubmitted && errorMessage" class="text-red-500">{{ errorMessage }}</div>
            <AuthSubmit class="w-56">Login to your account</AuthSubmit>
            <div class="text-sm font-medium text-gray-900 dark:text-white">
                Not registered yet?
                <NuxtLink to="/auth/file-sharing/regis" class="text-blue-600 hover:underline dark:text-blue-500">Create account</NuxtLink>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
const filesharing = useFileSharingStore();
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

import type LoginFileSharingResponse from "~/types/LoginFileSharingResponse";

const user = ref({
    email: "",
    password: "",
});

const formSubmitted = ref(false);
const errorMessage = ref("");

const submitForm = async () => {
    formSubmitted.value = true;

    if (!user.value.email || !user.value.password) {
        return;
    }

    filesharing
        .login(user.value)
        .then((response: LoginFileSharingResponse) => {
            if (response.status === true) {
                // Successful login (HTTP 200)
                filesharing.setUserJWTToken(response.data!.access_token!, response.data!.user!.username, response.data!.user!.email);
                navigateTo("/file-sharing/embedding");
                return;
            } else {
                errorMessage.value = response.message || "Failed to login";
            }
        })
        .catch((error) => {
            errorMessage.value = error.response._data.message || "Something went wrong";
        });
};
</script>

<style>
/* Add any custom styles or overrides here */
</style>
