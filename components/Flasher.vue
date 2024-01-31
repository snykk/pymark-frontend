<template>
    <div :class="statusClass" class="flex items-center justify-between mt-4 px-4 py-2 rounded">
        <svg v-if="props.label === FlashLabel.SUCCESS" class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <svg v-else-if="props.label === FlashLabel.DANGER" class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
        <svg v-else-if="props.label === FlashLabel.INFO" class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c.83 0 1.5.67 1.5 1.5S12.83 9 12 9s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm1.5 7h-3c-.28 0-.5.22-.5.5v5c0 .28.22.5.5.5h3c.28 0 .5-.22.5-.5v-5c0-.28-.22-.5-.5-.5z"
            ></path>
        </svg>
        <div
            :class="[
                {
                    'text-green-600': props.label === FlashLabel.SUCCESS,
                    'text-red-600': props.label === FlashLabel.DANGER,
                    'text-blue-600': props.label === FlashLabel.INFO,
                },
            ]"
        >
            {{ message }}
        </div>
        <button type="button" @click="clearFlasher" class="ml-auto p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none focus:ring focus:ring-gray-300" aria-label="Close">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>
</template>

<script setup lang="ts">
const flasher = useFlashStore();

const props = defineProps({
    message: String,
    label: String,
});

const emits = defineEmits(["close"]);

const statusClass = props.label === FlashLabel.SUCCESS ? "bg-green-200" : props.label === FlashLabel.DANGER ? "bg-red-200" : props.label === FlashLabel.INFO ? "bg-blue-200" : "bg-gray-200";

const clearFlasher = () => {
    emits("close");
    flasher.clearFlashMessage();
};
</script>

<style scoped>
/* Add any additional styling here if needed */
</style>
