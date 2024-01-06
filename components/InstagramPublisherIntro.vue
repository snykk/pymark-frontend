<template>
    <div>
        <div class="flex justify-center">
            <NuxtLink to="/"> <img alt="Vue logo" :class="expandLogoClass ?? ''" src="~/assets/logo/nuxt.svg" width="125" height="125" /></NuxtLink>
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

<style scoped></style>
