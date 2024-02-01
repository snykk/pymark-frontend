<template>
    <div ref="landing_root" :class="$colorMode.value" class="flex flex-col items-center justify-center h-screen font-sans text-center">
        <div class="flex justify-center md:pt-24 md:pb-10">
            <img alt="Vue logo" class="logo animate-bounce duration-75" src="~/assets/logo/nuxt.svg" width="125" height="125" />
        </div>
        <h1 class="text-xl md:text-4xl font-bold mb-4">PyMark Watermarking App</h1>
        <p class="text-base md:max-w-2xl mx-auto mb-8">
            Mark, Secure, and Share: Your go-to for watermarking, and copyright protection. Utilize google drive integration for secure storage, and instagram api for automatic publishing content
        </p>
        <!-- Toggle button -->
        <div class="flex flex-wrap justify-center md:justify-center pb-36">
            <NavigationButton label="file sharing" to="/file-sharing" />
            <NavigationButton label="instagram publisher" to="/instagram-publisher" />
        </div>
    </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode();
const landing_root = ref<HTMLElement | null>(null);

onMounted(() => {
    if (process.client) {
        landing_root.value?.classList.add(colorMode.value);
        landing_root.value?.classList.remove("system");
    }
});
</script>

<style scoped></style>
