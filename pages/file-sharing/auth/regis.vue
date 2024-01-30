<template>
    <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white text-center">Sign Up to PyMark</h2>
        <form class="mt-8 space-y-6" @submit.prevent="submitForm">
            <div>
                <AuthInput v-model="user.username" placeholder="John Doe" label="username" />
                <span v-if="formSubmitted && !user.username" class="text-red-500">Username is required</span>
            </div>
            <div>
                <AuthInput v-model="user.email" placeholder="name@company.com" label="email" />
                <span v-if="formSubmitted && !user.email" class="text-red-500">Email is required</span>
            </div>
            <div>
                <AuthInput v-model="user.password" placeholder="************" label="password" />
                <span v-if="formSubmitted && !user.password" class="text-red-500">Password is required</span>
            </div>
            <div v-if="formSubmitted && errorMessage" class="text-red-500">{{ errorMessage }}</div>
            <AuthSubmit class="w-48">Create an account</AuthSubmit>
            <div class="text-sm font-medium text-gray-900 dark:text-white">
                Already have an account?
                <NuxtLink to="/file-sharing/auth/login" class="text-blue-600 hover:underline dark:text-blue-500">Login Now!</NuxtLink>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import type RegisFileSharingResponse from "~/types/RegisFileSharingResponse";

const filesharing = useFileSharingStore();
const config = useRuntimeConfig();

definePageMeta({
    layout: "auth-filesharing",
    middleware: [
        function (to, from) {
            const { userJWTToken } = storeToRefs(useFileSharingStore());
            const jwtTOken = useCookie("userJWTToken");
            if (jwtTOken.value) {
                userJWTToken.value = jwtTOken.value;
                useRouter().push("/file-sharing/embedding");
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
            .then(async (response: unknown) => {
                const typedResponse = response as RegisFileSharingResponse;
                if (typedResponse.status) {
                    return navigateTo("/file-sharing/auth/verif-otp?email=" + user.value.email);
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
