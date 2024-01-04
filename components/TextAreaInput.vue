<template>
    <div>
        <label :for="id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ label }}</label>
        <textarea
            :id="id"
            rows="4"
            :value="modelValue"
            @input="emit('update:modelValue', $event.target.value)"
            class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            :placeholder="placeholder"
        ></textarea>
    </div>
</template>

<script setup>
const { id, label, modelValue, placeholder } = defineProps({
    id: String,
    modelValue: String,
    placeholder: String,
    label: String,
});

const emit = defineEmits(["update:modelValue"]);
</script>

<style scoped></style>
