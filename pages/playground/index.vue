<template>
    <div class="flex justify-center items-center h-screen">
        <div class="flex flex-col justify-center w-1/3">
            <LoadingIndicator class="h-full" :options="defaultOptions" />
            <h1 class="text-center text-xs md:text-xl lg:2xl">Please wait....</h1>
        </div>
    </div>
</template>

<script setup lang="ts">
import animationData from "~/assets/lotties/loading-animation2.json";

const defaultOptions = ref({ animationData });
</script>
