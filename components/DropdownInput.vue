<template>
    <div>
        <label :for="label" class="block mb-2 text-sm font-medium">{{ label }}</label>
        <select
            :id="label"
            :value="modelValue"
            @change="emit('update:modelValue', $event.target.value)"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
            <!-- only show "recommended" in value of 0.06 and embedding pages  -->
            <option v-for="option in options" :key="option" :value="option">{{ option }} {{ option == "0.06" && $route.path.split("/").slice(0, 3)[2] == "embedding" ? "(recommended)" : "" }}</option>
        </select>
    </div>
</template>

<script setup>
const { label, modelValue, options } = defineProps({
    modelValue: String,
    label: String,
    options: Array,
});

const emit = defineEmits(["update:modelValue"]);
</script>

<style scoped></style>
