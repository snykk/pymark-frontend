<template>
    <div>
        <button
            @click="scrollToTop"
            type="button"
            data-te-ripple-init
            v-if="show"
            data-te-ripple-color="light"
            class="back-to-top fixed bottom-[4.5rem] right-11 rounded-full p-3 text-xs font-medium uppercase leading-tight text-white shadow-md ease-in-out hover:shadow-lg focus:shadow-lg active:shadow-lg bg-gradient-to-br from-green-400 to-blue-600 hover:from-green-300 hover:to-blue-400 border border-transparent focus:outline-none focus:ring-4 focus:ring-green-200 dark:focus:ring-green-800 transition-all duration-300"
        >
            <svg aria-hidden="true" focusable="false" data-prefix="fas" class="h-4 w-4 animate-bounce" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path
                    fill="currentColor"
                    d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"
                ></path>
            </svg>
        </button>
    </div>
</template>

<script setup lang="ts">
const show = ref(false);

const handleScroll = () => {
    show.value = window.pageYOffset > 100;
};

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
};

onMounted(() => {
    window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
    window.removeEventListener("scroll", handleScroll);
});
</script>
