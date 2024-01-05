<template>
    <div>
        <div class="text-center px-3 xs:px-6 md:px-0">
            <FileSharingIntro class="mb-8 pt-8 pb-5 md:pt-24 md:pb-3" />
            <div class="flex flex-wrap justify-center md:justify-center">
                <NavigationButton label="embedding" to="/file-sharing/embedding" />
                <NavigationButton label="extraction" to="/file-sharing/extraction" />
                <NavigationButton label="analysis" to="/file-sharing/analysis" />
                <NavigationButton label="image processing" to="/file-sharing/image_processing" />
                <NavigationButton label="my drive" to="/file-sharing/my_drive" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped>
/* Styling sesuai kebutuhan Anda */
</style>
