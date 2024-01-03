<template>
    <div class="flex justify-center w-full flex-col">
        <label for="input-image" class="block mb-2 text-lg font-medium text-gray-900 dark:text-white">
            {{ label }}
        </label>
        <div v-if="previewImage" class="px-3">
            <img :src="previewImage" alt="Preview" class="w-40 h-40" />
        </div>
        <input
            id="input-image"
            class="block w-full mb-5 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            type="file"
            @change="handleFileInputChange"
        />
    </div>
</template>

<script setup lang="ts">
const { label } = defineProps(["label"]);

const previewImage = ref<string | null>(null);

const handleFileInputChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.value = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    }
};
</script>

<style>
/* Your styles here */
</style>
