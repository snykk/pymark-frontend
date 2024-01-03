<template>
    <div>
        <div class="text-center px-3 xs:px-6 md:px-0">
            <div class="flex justify-center pt-8 pb-5 md:pt-24 md:pb-10">
                <img alt="Vue logo" class="logo" src="~/assets/logo/nuxt.svg" width="125" height="125" />
            </div>
            <h1 class="text-4xl font-bold mb-4">PyMark Watermarking App</h1>
            <p class="max-w-2xl mx-auto mb-8">
                Seamlessly embed and extract watermarks, analyze image quality with PSNR and SSIM, ensure robustness with BER and NCC, and process images with various processing tools. Your all-in-one solution for watermarking, analysis,
                and image refinement."
            </p>
            <div class="flex flex-wrap justify-center md:justify-center">
                <NavigationButton label="embedding" to="/file-sharing/embedding" />
                <NavigationButton label="extraction" to="/file-sharing/extraction" />
                <NavigationButton label="analysis" to="/file-sharing/analysis" />
                <NavigationButton label="image processing" to="/file-sharing/image_processing" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped>
/* Styling sesuai kebutuhan Anda */
</style>
