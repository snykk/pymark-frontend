<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md w-full">
            <h1 class="text-2xl font-bold mb-6 text-center">Regis</h1>
            <form @submit.prevent="submitForm" class="space-y-4">
                <div class="flex flex-col">
                    <label for="username" class="mb-1">Username:</label>
                    <input type="text" id="username" v-model="user.username" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    <span v-if="formSubmitted && !user.username" class="text-red-500">Username is required</span>
                </div>
                <div class="flex flex-col">
                    <label for="email" class="mb-1">Email:</label>
                    <input type="text" id="email" v-model="user.email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    <span v-if="formSubmitted && !user.email" class="text-red-500">Email is required</span>
                </div>
                <div class="flex flex-col">
                    <label for="password" class="mb-1">Password:</label>
                    <input type="password" id="password" v-model="user.password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" />
                    <span v-if="formSubmitted && !user.password" class="text-red-500">Password is required</span>
                </div>
                <span v-if="formSubmitted && errorMessage" class="text-red-500">{{ errorMessage }}</span>
                <div class="flex items-center justify-between">
                    <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Login</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import type RegisFileSharingResponse from "~/types/RegisFileSharingResponse";

const filesharing = useFileSharingStore();
definePageMeta({
    middleware: [
        async function (to, from) {
            const { userJWTToken } = storeToRefs(useFileSharingStore());
            const jwtTOken = useCookie("userJWTToken");
            if (jwtTOken.value) {
                userJWTToken.value = jwtTOken.value;
                await navigateTo("/file-sharing");
            }
        },
    ],
});

const user = ref({
    username: "",
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

    try {
        filesharing
            .regis(user.value)
            .then((response: unknown) => {
                const typedResponse = response as RegisFileSharingResponse;
                if (typedResponse.status) {
                    navigateTo("/auth/file-sharing/login");
                    return;
                }

                errorMessage.value = typedResponse.message;
            })
            .catch((error) => {
                errorMessage.value = "Failed to create an account";
            });
    } catch (error) {
        errorMessage.value = "Something went wrong";
    }
};
</script>

<style>
/* Add any custom styles or overrides here */
</style>
