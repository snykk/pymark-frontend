<template>
    <div class="flex flex-col">
        <label :for="id" class="block mb-2 text-sm font-medium">{{ label }}</label>
        <img v-if="preview" :src="preview" class="ml-4 h-40 w-40 mb-3" :alt="alt" />
        <input
            :type="type"
            :id="id"
            :accept="accept"
            ref="fileInput"
            class="block w-full mb-5 text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            @change="handleImageChange($event)"
        />
        <span v-if="formSubmitted && !modelValue" class="text-red-500">{{ errorMessage }}</span>
    </div>
</template>

<script setup lang="ts">
const {
    label,
    id,
    modelValue,
    formSubmitted,
    errorMessage = "Image is required",
    alt = "Preview Image",
    accept = "image/*",
    type = "file",
} = defineProps({
    id: String,
    modelValue: Object,
    label: String,
    formSubmitted: Boolean,
    errorMessage: String,
    alt: String,
    accept: {
        type: String,
        default: "image/*",
    },
    type: {
        type: String,
        default: "file",
    },
});

const emit = defineEmits(["update:modelValue"]);

const fileInput = ref(null);
const preview = ref(null);

const handleImageChange = (event) => {
    const target = event.target;
    if (!target || !target.files) return;

    const file = target.files[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
            emit("update:modelValue", file);
            preview.value = result;
        }
    };
    fileReader.readAsDataURL(file);
};
</script>

<style scoped>
.dark input[type="file"]::file-selector-button {
    @apply bg-gray-600 hover:bg-gray-500 text-white;
}

input[type="file"]::file-selector-button {
    @apply bg-gray-200 hover:bg-gray-300 text-black;
}
</style>
