<template>
    <div>
        <label :for="label" class="mb-1">{{ label }}</label>
        <input
            :type="type"
            :id="label"
            :accept="accept"
            ref="fileInput"
            @change="handleFileChange($event)"
            class="block w-full mb-5 text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        />
    </div>
</template>

<script setup>
const {
    label,
    formSubmitted,
    fileType = "File",
    accept = ".npy",
    type = "file",
} = defineProps({
    label: String,
    formSubmitted: Boolean,
    fileType: String,
    accept: {
        type: String,
        default: ".npy",
    },
    type: {
        type: String,
        default: "file",
    },
});

const emit = defineEmits(["update:modelValue"]);

const fileInput = ref(null);
const file = ref(null);

const handleFileChange = (event) => {
    const target = event.target;
    if (!target || !target.files) return;

    const selectedFile = target.files[0];
    if (!selectedFile) return;

    emit("update:modelValue", selectedFile);
    file.value = selectedFile;
};
</script>

<style scoped></style>
