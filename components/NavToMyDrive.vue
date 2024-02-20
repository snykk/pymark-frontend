<template>
    <div>
        <button
            @click="navigateTo(to)"
            type="button"
            class="link-wrapper text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
            Go to My Drive
            <svg class="arrow-icon rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
            </svg>
        </button>
    </div>
</template>

<script setup lang="ts">
const { to } = defineProps(["to"]);
</script>

<style scoped>
.link-wrapper {
    position: relative;
}

.arrow-icon {
    transition: transform 0.3s ease; /* Menambahkan transisi transformasi */
}

.link-wrapper:hover .arrow-icon {
    transform: translateX(5px); /* Geser panah 5px ke kanan saat dihover */
}
</style>
