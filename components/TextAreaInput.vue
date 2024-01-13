<template>
    <div>
        <label :for="id" class="block mb-2 text-sm font-medium">{{ label }}</label>
        <textarea
            :id="id"
            rows="4"
            :value="modelValue"
            @input="emit('update:modelValue', $event.target.value)"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
