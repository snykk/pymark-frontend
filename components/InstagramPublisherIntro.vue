<template>
    <div>
        <div class="flex justify-center">
            <NuxtLink to="/" class="logo-container">
                <img src="~/assets/logo/nuxt.svg" class="logo logo-top-left" alt="Nuxt.js Logo" />
                <img src="~/assets/logo/instagram.svg" class="logo logo-bottom-right" alt="Google Drive Logo" />
            </NuxtLink>
        </div>
        <h1 class="text-4xl font-bold mb-4" :class="expandHeadingClass ?? ''">PyMark Instagram Publisher</h1>
        <p class="max-w-2xl mx-auto" :class="expandDescriptionClass ?? ''">
            Enhance your Instagram sharing experience with our Instagram Publisher, a sophisticated solution for effortless posting of watermarked images. Seamlessly automate posting while ensuring rigorous copyright protection for your
            creative content, preserving ownership and rights.
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
