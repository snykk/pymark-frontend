<template>
    <div class="text-center">
        <!-- Enhanced Message Info -->
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-5">Verify Your Account</h2>
        <div v-if="sendingState === 'sending'">
            <LoadingIndicator class="h-full mx-auto w-1/4" :options="defaultOptions" />
            <p class="w-full">Sending the otp code . . .</p>
        </div>
        <div v-else-if="sendingState === 'sended'">
            <p class="text-gray-600 dark:text-gray-400">
                We emailed you the six digit code to <span class="text-gray-200">{{ route.query.email }}</span>
            </p>
            <p class="text-gray-600 dark:text-gray-400">Enter the code below to confirm your email address</p>
        </div>
        <div v-else-if="sendingState === 'idle'">??????</div>

        <!-- New message info -->

        <form class="mt-8 space-y-6" @submit.prevent="submitForm">
            <div>
                <!-- Display six input boxes for OTP -->
                <div class="otp-container">
                    <input
                        v-for="(digit, index) in 6"
                        placeholder="0"
                        :key="index"
                        v-model="otp[index]"
                        min="0"
                        max="9"
                        type="number"
                        class="otp-input"
                        @input="handleInput(index, $event)"
                        @keydown="handleKeyDown(index, $event)"
                        @keyup="handleKeyUp(index, $event)"
                        @focus="handleFocus(index)"
                        ref="otpInputs"
                    />
                </div>
            </div>
            <div v-if="formSubmitted && errorMessage" class="text-red-500">
                {{ errorMessage }}
            </div>
            <AuthSubmit class="w-full">Send OTP Code</AuthSubmit>

            <div class="text-sm font-medium text-gray-900 dark:text-white">
                You didn't receive the code?
                <span @click="!isResendingOTP && resendOTP()" :class="{ 'text-gray-400 cursor-not-allowed': isResendingOTP }" class="text-blue-600 hover:underline dark:text-blue-500 cursor-pointer">
                    {{ isResendingOTP ? "Sending..." : "Resend!" }}
                </span>
            </div>
            <div v-if="successMessage" class="text-green-500">
                {{ successMessage }}
            </div>
        </form>
    </div>
</template>
<script setup lang="ts">
import type BaseApiResponse from "~/types/BaseApiResponse";
import animationData from "~/assets/lotties/loading-animation6.json";

const defaultOptions = ref({ animationData });

definePageMeta({
    layout: "auth-filesharing",
});

const otp = ref<string[]>(Array(6).fill(""));
const formSubmitted = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const isResendingOTP = ref(false);
const sendingState = ref<"idle" | "sending" | "sended">("idle");

const config = useRuntimeConfig();
const route = useRoute();
const { $swal } = useNuxtApp();
const flasher = useFlashStore();

const otpInputs = ref<HTMLElement[]>([]); // Create ref for inputs

onMounted(async () => {
    const email = route.query.email as string;

    if (!email) {
        $swal
            .fire({
                title: "The Email?",
                text: "The OTP email is not found",
                icon: "question",
                confirmButtonText: "Back",
            })
            .then((result: any) => {
                if (result.isConfirmed) {
                    // Here you can navigate the user using Nuxt.js router
                    return navigateTo("/"); // Replace '/' with the desired route
                }
            });

        return;
    }

    try {
        sendingState.value = "sending";
        const otpResponse = await sendOTP(email);

        // If the function call is successful, you can use the response data here
        console.log("OTP sent successfully:", otpResponse);
    } catch (error) {
        // If an error occurs during the function call, it will be caught here
        console.error("Error sending OTP:", error);
        // Handle the error gracefully, display an error message to the user, etc.
    }
    sendingState.value = "sended";
});

const submitForm = async () => {
    errorMessage.value = "";
    formSubmitted.value = true;
    const email = route.query.email as string;

    if (!email) {
        errorMessage.value = "Email is null";
    }

    if (!otp.value.every((digit: string) => digit)) {
        errorMessage.value = "Please enter the complete OTP";
        return;
    }

    try {
        const response: BaseApiResponse<null> = await $fetch(config.public.api_base + `/auth/verify_otp?email=${email}&otp=${otp.value.join("")}`, {
            method: "GET",
        });

        if (response.status) {
            // OTP verification successful
            // Redirect to login form
            flasher.setFlashMessage(response.message, FlashLabel.SUCCESS);
            return navigateTo("/file-sharing/auth/login");
        }

        errorMessage.value = response.message;
    } catch (error: any) {
        errorMessage.value = error.response._data.message || "Something went wrong";
    }
};

const resendOTP = async () => {
    successMessage.value = "";
    isResendingOTP.value = true;
    const email = route.query.email as string;

    try {
        const otpResponse = await sendOTP(email);
        if (!otpResponse.status) {
            errorMessage.value = otpResponse.message;
        }

        successMessage.value = otpResponse.message;
    } catch (error: any) {
        errorMessage.value = error.response._data.message;
    }

    isResendingOTP.value = false;
};

const sendOTP = async (email: string) => {
    try {
        const formData = new FormData();
        formData.append("email", email);

        const response: BaseApiResponse<null> = await $fetch(config.public.api_base + "/auth/send_otp", {
            method: "POST",
            body: formData,
        });

        if (!response.status) {
            // If the response is not successful, throw an error
            throw new Error("Failed to send OTP. Status: " + response.status);
        }

        // If the response is successful, return the data
        return response;
    } catch (error) {
        // Catch any errors that occur during the execution of the function
        console.error("Error sending OTP:", error);
        throw error; // Re-throw the error to propagate it to the caller
    }
};

const handleKeyDown = (index: number, event: KeyboardEvent) => {
    if (event.key === "Backspace" && index > 0 && !otp.value[index]) {
        // If the current input is empty and Backspace is pressed, move focus to the left box
        const prevIndex = index - 1;
        otpInputs.value[prevIndex].focus();
    } else if (event.key === "ArrowLeft" && index > 0) {
        // If the Left arrow key is pressed and not at the first input, move focus to the left box
        const prevIndex = index - 1;
        otpInputs.value[prevIndex].focus();
    } else if (event.key === "ArrowRight" && index < otp.value.length - 1) {
        // If the Right arrow key is pressed and not at the last input, move focus to the right box
        const nextIndex = index + 1;
        otpInputs.value[nextIndex].focus();
    }
};

const handleKeyUp = (index: number, event: KeyboardEvent) => {
    if ((event.key === "ArrowLeft" || event.key === "ArrowRight") && index >= 0 && index < otp.value.length) {
        // Update the value after arrow keys are released
        otp.value[index] = otpInputs.value[index].value;
        // Select the value after arrow keys are released
        otpInputs.value[index].select();
    }
};

const handleInput = (index: number, event: InputEvent) => {
    const inputValue = event.target.value;
    const numericValue = parseInt(inputValue, 10);

    if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 9) {
        otp.value[index] = numericValue.toString();
        focusNext(index);
    } else {
        // Clear the OTP value if an invalid input is entered
        otp.value[index] = "";
    }
};

const handleFocus = (index: number) => {
    // Select the value when the input gets focus
    otpInputs.value[index].select();
};

const focusNext = (index: number) => {
    const nextIndex = index + 1;
    if (nextIndex < otp.value.length) {
        otpInputs.value[nextIndex].focus();
    }
};
</script>

<style scoped>
input {
    color: black;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type="number"] {
    -moz-appearance: textfield;
}

.otp-container {
    display: flex;
    justify-content: center;
}

.otp-input {
    width: 50px;
    height: 50px;
    text-align: center;
    font-size: 1.5rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin: 0 5px;
}

.text-red-500 {
    color: #e53e3e;
}
</style>
