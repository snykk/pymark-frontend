<template>
    <div>
        <div class="flex justify-center mb-3">
            <NuxtLink to="/" class="logo-container">
                <img src="~/assets/logo/nuxt.svg" class="logo logo-top-left" alt="Nuxt.js Logo" />
                <img src="~/assets/logo/google-drive.svg" class="logo logo-bottom-right" alt="Google Drive Logo" />
            </NuxtLink>
        </div>
        <h1 class="text-4xl font-bold mb-4" :class="expandHeadingClass ?? ''">PyMark File Sharing</h1>
        <p class="max-w-2xl mx-auto" :class="expandDescriptionClass ?? ''">
            Seamlessly embed and extract watermarks, analyze image quality with PSNR and SSIM, ensure robustness with BER and NCC, and process images with various processing tools. Your all-in-one solution for watermarking, analysis, and
            image refinement.
        </p>
    </div>
</template>

<script setup lang="ts">
const { expandLogoClass, expandHeadingClass, expandDescriptionClass } = defineProps({
    expandLogoClass: {
        type: String,
    },
    expandHeadingClass: {
        type: String,
    },
    expandDescriptionClass: {
        type: String,
    },
});
</script>

<style scoped>
.logo-container {
    position: relative;
    width: 150px;
    height: 150px;
}

.logo {
    position: absolute;
    width: 100px;
}

.logo-top-left {
    top: 15px;
    left: 0;
}

.logo-bottom-right {
    bottom: 15px;
    right: 0;
}
</style>
