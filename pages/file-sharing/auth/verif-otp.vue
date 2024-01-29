<template>
    <div class="text-center">
        <!-- Enhanced Message Info -->
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-5">Verify Your Account</h2>
        <p class="text-gray-600 dark:text-gray-400">
            We emailed you the six digit code to <span class="text-gray-200">{{ route.query.email }}</span>
        </p>
        <p class="text-gray-600 dark:text-gray-400">Enter the code below to confirm your email address</p>
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
                <span @click="sendOTP" class="text-blue-600 hover:underline dark:text-blue-500 cursor-pointer">Resend!</span>
            </div>
        </form>
    </div>
</template>
<script setup lang="ts">
definePageMeta({
    layout: "auth-filesharing",
});

const otp = ref<string[]>(Array(6).fill(""));
const formSubmitted = ref(false);
const errorMessage = ref("");

const config = useRuntimeConfig();
const route = useRoute();

const otpInputs = ref<HTMLElement[]>([]); // Create ref for inputs

const submitForm = async () => {
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
        const response = await verifyOTP(otp.value.join(""), email); // Call OTP verification function
        if (response.status) {
            // OTP verification successful
            // Redirect to login form
            return navigateTo("/file-sharing/auth/login");
        } else {
            errorMessage.value = response.message || "Failed to verify OTP";
        }
    } catch (error) {
        errorMessage.value = error.message || "Something went wrong";
    }
};

const sendOTP = async () => {
    const formData = new FormData();

    const email = route.query.email as string;

    if (!email) {
        errorMessage.value = "Email is null";
    }

    formData.append("email", email);

    const response = await $fetch(config.public.api_base + "/auth/send_otp", {
        method: "POST",
        body: formData,
    });
};

const verifyOTP = async (otp: string, email: string | null) => {
    try {
        if (!email) {
            throw new Error("Email is missing");
        }

        const response = await $fetch<OTPResponse>(config.public.api_base + `/auth/verify_otp?email=${email}&otp=${otp}`, {
            method: "GET",
        });

        return response;
    } catch (error) {
        throw new Error("Failed to verify OTP");
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

interface OTPResponse {
    message: string;
    status: boolean;
}
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
