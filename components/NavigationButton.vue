<template>
    <NuxtLink :to="to" class="">
        <button
            :class="[
                'relative inline-flex text-white items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium rounded-lg group focus:outline-none focus:ring-4 focus:ring-green-200 dark:focus:ring-green-800 transition-all duration-300 ',
                {
                    'bg-gradient-to-br from-green-400 to-blue-600 hover:from-green-300 hover:to-blue-400': $route.path.split('/').slice(0, 3).join('/') !== to,
                    'bg-gradient-to-bl from-green-400 to-blue-600 hover:from-green-400 hover:to-blue-500': $route.path.split('/').slice(0, 3).join('/') === to,
                },
            ]"
        >
            <span
                :class="[
                    'relative py-2 px-4 rounded-md transition-all duration-300 capitalize',
                    {
                        'bg-white dark:bg-gray-900': $route.path.split('/').slice(0, 3).join('/') !== to,
                        'bg-opacity-0': $route.path.split('/').slice(0, 3).join('/') === to,
                    },
                ]"
            >
                {{ label }}
            </span>
        </button>
    </NuxtLink>
</template>

<script setup lang="ts">
const { label, to } = defineProps(["label", "to"]);
</script>
