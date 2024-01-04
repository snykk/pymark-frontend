<template>
    <div ref="lavContainer"></div>
</template>

<script setup lang="ts">
import lottie from "lottie-web";

const props = defineProps({
    options: {
        type: Object as PropType<{ animationData: any; loop?: boolean; autoplay?: boolean; rendererSettings?: any }>,
        required: true,
    },
    height: Number,
    width: Number,
});

const emit = defineEmits(["animCreated"]);

let anim: any = null;

const lavContainer = ref<HTMLElement | null>(null);

onMounted(() => {
    if (lavContainer.value) {
        anim = lottie.loadAnimation({
            container: lavContainer.value,
            renderer: "svg",
            loop: props.options.loop !== false,
            autoplay: props.options.autoplay !== false,
            animationData: props.options.animationData,
            rendererSettings: props.options.rendererSettings,
        });
        emit("animCreated", anim);
    }
});
</script>
