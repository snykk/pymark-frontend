<template>
    <div>
        <h2>Halaman Index file-sharing</h2>
        <!-- Konten untuk fitur Embedding -->
        <p>Ini adalah halaman untuk fitur Index file-sharing.</p>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: ["auth-filesharing"],
});

const filesharing = useFileSharingStore();
</script>

<style scoped>
/* Styling untuk halaman Embedding */
</style>
