<template>
    <div>
        <div class="flex justify-center">
            <img alt="Vue logo" :class="expandLogoClass ?? ''" src="~/assets/logo/nuxt.svg" width="125" height="125" />
        </div>
        <h1 class="text-4xl font-bold mb-4" :class="expandHeadingClass ?? ''">PyMark Watermarking App</h1>
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

<style scoped></style>
